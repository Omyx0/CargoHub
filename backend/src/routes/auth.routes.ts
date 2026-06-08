// ============================================================================
// Auth Routes
// POST /auth/register-user, POST /auth/register-driver, POST /auth/register-tokens, GET /auth/me
// ============================================================================

import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../config/database';
import { verifyFirebaseToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { RegisterUserSchema, RegisterDriverSchema, RegisterTokensSchema } from '@cargohub/shared';

const router = Router();

// Register new user
router.post('/register-user', validate(RegisterUserSchema), (req, res) => {
  const mockUid = req.headers['x-mock-uid'] as string || `user-${uuid().slice(0, 8)}`;
  const existing = db.users.findByFirebaseUid(mockUid);
  if (existing) {
    res.json({ success: true, data: existing, message: 'User already exists.' });
    return;
  }

  const user = db.users.create({
    id: uuid(),
    firebaseUid: mockUid,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    role: 'USER',
    accountType: 'STANDARD',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, data: user });
});

// Register new driver
router.post('/register-driver', validate(RegisterDriverSchema), (req, res) => {
  const mockUid = req.headers['x-mock-uid'] as string || `driver-${uuid().slice(0, 8)}`;
  const existing = db.users.findByFirebaseUid(mockUid);
  if (existing) {
    res.json({ success: true, data: existing, message: 'Driver already exists.' });
    return;
  }

  const driverId = uuid();
  db.users.create({
    id: driverId,
    firebaseUid: mockUid,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    role: 'DRIVER',
    accountType: 'STANDARD',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const driver = db.drivers.create({
    id: driverId,
    firebaseUid: mockUid,
    name: req.body.name,
    phone: req.body.phone,
    vehicleType: req.body.vehicleType,
    vehicleNumber: req.body.vehicleNumber,
    rating: 0,
    totalTrips: 0,
    kycStatus: 'UNSUBMITTED',
    isAvailable: false,
    isActive: true,
    earnings: { today: 0, thisWeek: 0, thisMonth: 0, tripCount: 0 },
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({ success: true, data: driver });
});

// Register push notification tokens
router.post('/register-tokens',
  verifyFirebaseToken,
  requireRole('USER', 'DRIVER'),
  validate(RegisterTokensSchema),
  (req, res) => {
    db.notificationTokens.set(req.user!.uid, {
      fcmToken: req.body.fcmToken,
      apnsToken: req.body.apnsToken,
      oneSignalId: req.body.oneSignalId,
      platform: req.body.platform,
    });
    res.json({ success: true, message: 'Notification tokens registered.' });
  }
);

// Get current user profile
router.get('/me', verifyFirebaseToken, (req, res) => {
  const user = db.users.findByFirebaseUid(req.user!.uid);
  if (!user) {
    res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
    return;
  }

  // If driver, include driver profile
  if (user.role === 'DRIVER') {
    const driver = db.drivers.findByFirebaseUid(req.user!.uid);
    res.json({ success: true, data: { ...user, driver } });
    return;
  }

  res.json({ success: true, data: user });
});

export default router;
