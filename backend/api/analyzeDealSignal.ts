import express from 'express';
import { analyzeAndUpdateDealSignal } from '../lib/analyzeSignal';

const router = express.Router();

/**
 * POST /api/analyze-deal-signal
 * Analyzes a deal and updates its signal based on AI analysis
 */
router.post('/', async (req, res) => {
  try {
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({ error: 'dealId is required' });
    }

    console.log(`📊 Request to analyze deal signal: ${dealId}`);

    const result = await analyzeAndUpdateDealSignal(dealId);

    res.json({
      success: true,
      signal: result.signal,
      rationale: result.rationale,
    });
  } catch (error) {
    console.error('Error analyzing deal signal:', error);
    res.status(500).json({
      error: 'Failed to analyze deal signal',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
