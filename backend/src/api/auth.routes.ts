// ============================================================================
// Auth Routes
// POST /auth/register-user, POST /auth/register-driver, POST /auth/register-tokens, GET /auth/me
// ============================================================================

import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../config/database';
import { auth } from '../config/firebase';
import { sendSMS } from '../config/services';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { RegisterUserSchema, RegisterDriverSchema, RegisterTokensSchema } from '@cargohub/shared';

const router = Router();

// ── Mobile OTP Logic (MSG91) ─────────────────────────────────────────────────

// Generate and Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ success: false, error: 'Phone number required' });
      return;
    }

    // Generate 6-digit OTP
    const isTestNumber = phone === process.env.TEST_PHONE_NUMBER; // Remove hardcoded test number
    const otp = isTestNumber ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    // Cache in Redis
    await db.authOTP.setOTP(phone, otp);

    // Send SMS via MSG91 (skip only if using specific test number)
    if (!isTestNumber) {
      const templateId = process.env.MSG91_OTP_TEMPLATE_ID || '';
      try {
        await sendSMS(phone, templateId, { var: otp });
      } catch (smsError: any) {
        console.error(`[MSG91 ERROR] Failed to send to ${phone}`, smsError);
        res.status(500).json({ success: false, error: 'Failed to send SMS via MSG91' });
        return;
      }
    } else {
      console.log(`[TEST OTP] Phone: ${phone}, OTP: ${otp}`);
    }

    res.json({ success: true, message: 'OTP sent successfully via MSG91' });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
});

// Verify OTP & Issue Custom Token
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      res.status(400).json({ success: false, error: 'Phone and OTP required' });
      return;
    }

    const cachedOtp = await db.authOTP.getOTP(phone);
    // Upstash returns numbers for numeric strings, so coerce to string first
    const cleanCachedOtp = cachedOtp ? String(cachedOtp).replace(/^"|"$/g, '') : null;
    
    if (!cleanCachedOtp || cleanCachedOtp !== String(otp)) {
      res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
      return;
    }

    // Delete OTP after successful verification
    await db.authOTP.deleteOTP(phone);

    if (!auth) {
      console.warn('Firebase Auth not initialized. Returning mock custom token for testing.');
      return res.json({ 
        success: true, 
        token: 'mock-custom-token-for-testing', 
        isNewUser: false 
      });
    }

    // Check if user exists in Firebase, otherwise create them
    let userRecord;
    let isNewUser = false;
    let customToken = 'mock-custom-token-for-testing';

    try {
      try {
        userRecord = await auth.getUserByPhoneNumber(phone);
      } catch (e: any) {
        if (e.code === 'auth/user-not-found') {
          userRecord = await auth.createUser({ phoneNumber: phone });
          isNewUser = true;
        } else {
          throw e;
        }
      }
      // Generate Firebase Custom Token
      customToken = await auth.createCustomToken(userRecord.uid);
    } catch (firebaseError: any) {
      console.warn('Firebase Auth failed (possibly not enabled in console). Returning mock token.', firebaseError.message);
      isNewUser = true; // Default to new user for testing if Firebase fails
    }

    res.json({ 
      success: true, 
      token: customToken, 
      isNewUser 
    });
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
});

// ── Registration & Profile ───────────────────────────────────────────────────

// Register new user
router.post('/register-user', verifyFirebaseToken, validate(RegisterUserSchema), (req, res) => {
  const firebaseUid = req.user!.uid;
  const existing = db.users.findByFirebaseUid(firebaseUid);
  if (existing) {
    res.json({ success: true, data: existing, message: 'User already exists.' });
    return;
  }

  const user = db.users.create({
    id: uuid(),
    firebaseUid: firebaseUid,
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
router.post('/register-driver', verifyFirebaseToken, validate(RegisterDriverSchema), (req, res) => {
  const firebaseUid = req.user!.uid;
  const existing = db.users.findByFirebaseUid(firebaseUid);
  if (existing) {
    res.json({ success: true, data: existing, message: 'Driver already exists.' });
    return;
  }

  const driverId = uuid();
  db.users.create({
    id: driverId,
    firebaseUid: firebaseUid,
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
    firebaseUid: firebaseUid,
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
