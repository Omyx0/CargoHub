// ============================================================================
// Role Guard Middleware
// Checks req.user.role against allowed roles — 403 if not permitted
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@cargohub/shared';

export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    const { role, isActive } = req.user;

    // Suspended accounts cannot do anything
    if (!isActive) {
      res.status(403).json({
        success: false,
        error: 'ACCOUNT_SUSPENDED',
        message: 'Your account has been suspended. Contact support.',
      });
      return;
    }

    if (!roles.includes(role)) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Role '${role}' cannot access this resource.`,
        required: roles,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to require B2B account type (extends USER)
 */
export const requireB2B = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'USER' || req.user.accountType !== 'B2B') {
    res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'This resource requires a B2B account.',
    });
    return;
  }
  next();
};
