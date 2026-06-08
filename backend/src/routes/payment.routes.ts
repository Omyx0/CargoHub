// ============================================================================
// Payment Routes
// POST /payments/create-order, POST /payments/verify, POST /payments/webhook
// ============================================================================

import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../config/database';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { CreatePaymentOrderSchema, VerifyPaymentSchema } from '@cargohub/shared';

const router = Router();

// Create Razorpay order (USER only)
router.post('/create-order',
  verifyFirebaseToken,
  requireRole('USER'),
  validate(CreatePaymentOrderSchema),
  (req, res) => {
    const booking = db.bookings.findById(req.body.bookingId);

    if (!booking) {
      res.status(404).json({ success: false, error: 'BOOKING_NOT_FOUND' });
      return;
    }

    if (booking.userId !== req.user!.uid) {
      res.status(403).json({ success: false, error: 'FORBIDDEN' });
      return;
    }

    if (booking.status !== 'DELIVERED') {
      res.status(400).json({
        success: false,
        error: 'BOOKING_NOT_DELIVERED',
        message: 'Payment can only be made after delivery.',
      });
      return;
    }

    // Mock Razorpay order creation
    const orderId = `order_${uuid().replace(/-/g, '').slice(0, 14)}`;
    const amount = booking.finalFare || booking.fareEstimate;

    db.bookings.update(booking.id, { paymentStatus: 'PENDING' });

    res.json({
      success: true,
      data: {
        orderId,
        amount: amount * 100, // Razorpay uses paise
        currency: 'INR',
        bookingId: booking.id,
      },
    });
  }
);

// Verify payment signature (USER only)
router.post('/verify',
  verifyFirebaseToken,
  requireRole('USER'),
  validate(VerifyPaymentSchema),
  (req, res) => {
    // In production: verify HMAC-SHA256 signature with Razorpay secret
    // For dev: auto-approve
    const orderId = req.body.razorpay_order_id;

    // Find booking by looking through all bookings
    const allBookings = db.bookings.getAll();
    const booking = allBookings.data.find(b => b.paymentStatus === 'PENDING' && b.userId === req.user!.uid);

    if (booking) {
      db.bookings.update(booking.id, {
        paymentStatus: 'PAID',
        finalFare: booking.finalFare || booking.fareEstimate,
      });

      // Emit payment confirmation
      const io = req.app.get('io');
      io.to(`booking:${booking.id}`).emit('booking:status', {
        bookingId: booking.id,
        status: booking.status,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully.',
      data: { paymentId: req.body.razorpay_payment_id },
    });
  }
);

// Razorpay webhook (server-to-server, no auth)
router.post('/webhook', (req, res) => {
  // In production: verify x-razorpay-signature header
  console.log('Razorpay webhook received:', req.body.event);
  res.json({ status: 'ok' });
});

export default router;
