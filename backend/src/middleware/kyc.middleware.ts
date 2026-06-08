// ============================================================================
// KYC Guard Middleware
// Drivers must be KYC-verified to go online or accept bookings
// ============================================================================

import type { Request, Response, NextFunction } from 'express';

export const requireVerifiedKyc = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.kycStatus !== 'VERIFIED') {
    res.status(403).json({
      success: false,
      error: 'KYC_REQUIRED',
      message: 'Complete KYC verification before accepting bookings.',
      kycStatus: req.user?.kycStatus,
    });
    return;
  }
  next();
};
