import type { Request, Response, NextFunction } from 'express';
import { aj } from '../config/services';

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only apply arcjet if key is set
    if (!process.env.ARCJET_KEY || process.env.ARCJET_KEY.startsWith('ajkey_')) {
      return next();
    }
    
    // Create an Arcjet decision
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests", reason: "Rate limit exceeded" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Forbidden", reason: "Automated traffic detected" });
      } else {
        res.status(403).json({ error: "Forbidden", reason: "Access denied by security policy" });
      }
      return;
    }
    
    next();
  } catch (error) {
    console.error('Arcjet error:', error);
    next();
  }
};
