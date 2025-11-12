import express, { Request, Response } from 'express';
import { buildDealContext } from '../lib/buildDealContext';
import { generateCompletion } from '../lib/openaiClient';
import { SYSTEM_PROMPT, buildDealRiskPrompt } from '../lib/promptTemplates';

const router = express.Router();

/**
 * POST /api/analyze-deal
 * Analyzes a deal for risk factors and provides insights
 */
router.post('/analyze-deal', async (req: Request, res: Response) => {
  try {
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({ error: 'dealId is required' });
    }

    // Build context from Supabase data
    const context = await buildDealContext(dealId);

    // Generate AI analysis
    const analysis = await generateCompletion({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildDealRiskPrompt(context),
      temperature: 0.7,
      maxTokens: 500,
      model: 'gpt-4'
    });

    res.json({
      success: true,
      analysis,
      dealId
    });
  } catch (error) {
    console.error('Error analyzing deal:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to analyze deal',
      details: message
    });
  }
});

export default router;
