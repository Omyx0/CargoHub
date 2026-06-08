// ============================================================================
// Firebase Token Verification Middleware
// Mock implementation — accepts X-Mock-UID header for development
// Replace with real Firebase Admin SDK verification in production
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Development mode: accept mock UID header
  const mockUid = req.headers['x-mock-uid'] as string;
  const authHeader = req.headers.authorization;

  let uid: string | null = null;

  if (mockUid) {
    // Dev mode — use mock UID directly
    uid = mockUid;
  } else if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // In production: const decodedToken = await admin.auth().verifyIdToken(token);
    // For dev: treat the token as the UID
    uid = token;
  }

  if (!uid) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing Bearer token or X-Mock-UID header.',
    });
    return;
  }

  // Look up user in database
  const user = db.users.findByFirebaseUid(uid);

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'No user found for this authentication token.',
    });
    return;
  }

  // Attach user to request
  const driver = db.drivers.findByFirebaseUid(uid);
  req.user = {
    uid: user.firebaseUid,
    role: user.role,
    accountType: user.accountType,
    kycStatus: driver?.kycStatus,
    isActive: user.isActive,
  };

  next();
};
