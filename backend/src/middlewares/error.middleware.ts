import type { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);
  
  // Capture exception in Sentry
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.',
  });
};
