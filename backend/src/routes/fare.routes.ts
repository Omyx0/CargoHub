// ============================================================================
// Fare Routes — POST /fare/estimate
// ============================================================================

import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { FareEstimateSchema, calculateFare } from '@cargohub/shared';

const router = Router();

// Fare estimate — publicly accessible (no auth for landing page widget)
router.post('/estimate', validate(FareEstimateSchema), (req, res) => {
  const fare = calculateFare(req.body);
  res.json({ success: true, data: fare });
});

export default router;
