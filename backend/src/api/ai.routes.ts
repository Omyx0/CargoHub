import { Router } from 'express';
import { ai } from '../config/services';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/extract-cargo', verifyFirebaseToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      res.status(400).json({ success: false, error: 'MISSING_TEXT' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
       res.status(503).json({ success: false, error: 'AI_SERVICE_UNAVAILABLE' });
       return;
    }

    const prompt = `Extract cargo details from the following text and return a JSON object with 'vehicleType' (e.g. 'TATA_ACE', 'TEMPO_407', 'PICKUP_TRUCK', 'LARGE_TRUCK') and 'loadType' (e.g. 'FURNITURE', 'ELECTRONICS', 'CONSTRUCTION_MATERIAL', 'GENERAL'). 
Text: "${text}"`;

    const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
    });

    const data = JSON.parse(result.text || "{}");

    res.json({
      success: true,
      data
    });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ success: false, error: 'AI_EXTRACTION_FAILED' });
  }
});

export default router;
