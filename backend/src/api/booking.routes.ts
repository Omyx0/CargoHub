// ============================================================================
// Booking Routes
// POST /bookings, GET /bookings, GET /bookings/:id, PATCH /bookings/:id/cancel
// GET /bookings/driver/active
// ============================================================================

import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../config/database';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { requireVerifiedKyc } from '../middlewares/kyc.middleware';
import { validateBookingOwnership } from '../middlewares/ownership.middleware';
import { validate } from '../middlewares/validate.middleware';
import { logsnag, resend, sendSMS } from '../config/services';
import {
  CreateBookingSchema, CancelBookingSchema,
  calculateFare, USER_CANCELLABLE_STATUSES, FEE_CANCELLATION_STATUSES,
} from '@cargohub/shared';
import type { Booking } from '@cargohub/shared';

const router = Router();

// Create new booking (USER only)
router.post('/',
  verifyFirebaseToken,
  requireRole('USER'),
  validate(CreateBookingSchema),
  async (req, res) => {
    try {
      const fare = calculateFare({
        pickupLat: req.body.pickupLat,
        pickupLng: req.body.pickupLng,
        dropLat: req.body.dropLat,
        dropLng: req.body.dropLng,
        vehicleType: req.body.vehicleType,
        loadType: req.body.loadType,
        helpersRequested: req.body.helpersRequested,
      });

      const booking: Booking = {
        id: uuid(),
        bookingRef: `FA-${Date.now().toString(36).toUpperCase()}`,
        userId: req.user!.uid,
        pickupLat: req.body.pickupLat,
        pickupLng: req.body.pickupLng,
        pickupAddress: req.body.pickupAddress,
        dropLat: req.body.dropLat,
        dropLng: req.body.dropLng,
        dropAddress: req.body.dropAddress,
        vehicleType: req.body.vehicleType,
        loadType: req.body.loadType,
        helpersRequested: req.body.helpersRequested,
        fareEstimate: fare.total,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.bookings.create(booking);

      // Track in LogSnag
      if (process.env.LOGSNAG_TOKEN) {
        logsnag.track({
          channel: 'bookings',
          event: 'New Booking',
          user_id: booking.userId,
          description: `Booking ${booking.bookingRef} created for ${booking.vehicleType}`,
          icon: '📦',
          tags: {
            vehicle_type: booking.vehicleType,
          }
        }).catch(e => console.error(e));
      }

      // Find nearest driver and emit Socket.io event
      const nearbyDrivers = await db.drivers.findNearby(
        req.body.pickupLat,
        req.body.pickupLng,
        req.body.vehicleType
      );

      if (nearbyDrivers.length > 0) {
        const io = req.app.get('io');
        // Notify the first driver via socket
        const targetDriver = nearbyDrivers[0];
        io.to(`driver:${targetDriver.firebaseUid}`).emit('booking:new', booking);
        
        // Notify driver via SMS
        if (targetDriver.phone) {
          sendSMS(targetDriver.phone, 'booking_alert_template', {
            pickup: booking.pickupAddress.substring(0, 30),
            fare: booking.fareEstimate.toString()
          });
        }
      }

      // Send Email to User
      const user = await db.users.findByFirebaseUid(booking.userId);
      if (user?.email && process.env.RESEND_API_KEY) {
        resend.emails.send({
          from: 'CargoHub <noreply@cargohub.com>',
          to: user.email,
          subject: `Booking Confirmation - ${booking.bookingRef}`,
          html: `<p>Your booking <strong>${booking.bookingRef}</strong> has been created. We are finding a driver for you.</p>`
        }).catch(e => console.error(e));
      }

      res.status(201).json({
        success: true,
        data: { booking, fareBreakdown: fare },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  }
);

// Get user's booking history (USER only)
router.get('/',
  verifyFirebaseToken,
  requireRole('USER'),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;

      const result = await db.bookings.findByUserId(req.user!.uid, page, limit, status as any);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  }
);

// Get driver's active booking (DRIVER only)
router.get('/driver/active',
  verifyFirebaseToken,
  requireRole('DRIVER'),
  requireVerifiedKyc,
  async (req, res) => {
    try {
      const booking = await db.bookings.findDriverActive(req.user!.uid);
      res.json({ success: true, data: booking });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  }
);

// Get single booking detail (USER own, DRIVER assigned, ADMIN any)
router.get('/:id',
  verifyFirebaseToken,
  async (req, res) => {
    try {
      const booking = await db.bookings.findById(req.params.id as string);

      if (!booking) {
        res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND' });
        return;
      }

      // Access control
      if (req.user!.role === 'ADMIN') {
        // Admin can see any booking
      } else if (req.user!.role === 'USER' && booking.userId !== req.user!.uid) {
        res.status(403).json({ success: false, error: 'FORBIDDEN' });
        return;
      } else if (req.user!.role === 'DRIVER' && booking.driverId !== req.user!.uid) {
        res.status(403).json({ success: false, error: 'FORBIDDEN' });
        return;
      }

      // Attach driver info if assigned
      if (booking.driverId) {
        const driver = await db.drivers.findByFirebaseUid(booking.driverId);
        if (driver) {
          booking.driver = {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            vehicleType: driver.vehicleType,
            vehicleNumber: driver.vehicleNumber,
            profilePhoto: driver.profilePhoto,
            rating: driver.rating,
            totalTrips: driver.totalTrips,
            currentLat: driver.currentLat,
            currentLng: driver.currentLng,
          };
        }
      }

      res.json({ success: true, data: booking });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  }
);

// Cancel booking (USER only, own bookings)
router.patch('/:id/cancel',
  verifyFirebaseToken,
  requireRole('USER'),
  validateBookingOwnership('user'),
  validate(CancelBookingSchema),
  async (req, res) => {
    try {
      const booking = req.booking as Booking;

      if (!USER_CANCELLABLE_STATUSES.includes(booking.status)) {
        res.status(400).json({
          success: false,
          error: 'CANNOT_CANCEL',
          message: `Booking in status '${booking.status}' cannot be cancelled.`,
        });
        return;
      }

      const hasFee = FEE_CANCELLATION_STATUSES.includes(booking.status);

      const updated = await db.bookings.update(booking.id, {
        status: 'CANCELLED',
        cancellationReason: req.body.reason || 'Cancelled by user',
      });

      // Track in LogSnag
      if (process.env.LOGSNAG_TOKEN) {
        logsnag.track({
          channel: 'bookings',
          event: 'Booking Cancelled',
          user_id: booking.userId,
          description: `Booking ${booking.bookingRef} cancelled.`,
          icon: '❌',
        }).catch(e => console.error(e));
      }

      // Notify driver if assigned
      if (booking.driverId) {
        const io = req.app.get('io');
        io.to(`booking:${booking.id}`).emit('booking:cancelled', {
          bookingId: booking.id,
          reason: req.body.reason || 'Cancelled by user',
        });
      }

      res.json({
        success: true,
        data: updated,
        cancellationFee: hasFee ? 50 : 0,
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  }
);

export default router;
