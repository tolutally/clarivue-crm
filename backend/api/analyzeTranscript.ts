import express, { Request, Response } from 'express';
import { generateCompletion } from '../lib/openaiClient';
import { SYSTEM_PROMPT, buildCallAnalysisPrompt } from '../lib/promptTemplates';

const router = express.Router();

/**
 * POST /api/analyze-transcript
 * Analyzes a call transcript to extract insights
 */
router.post('/analyze-transcript', async (req: Request, res: Response) => {
  try {
    const { transcript, summary } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'transcript is required' });
    }

    // Generate AI analysis
    const analysis = await generateCompletion({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildCallAnalysisPrompt(transcript, summary),
      temperature: 0.7,
      maxTokens: 800, // More tokens for detailed call analysis
      model: 'gpt-4'
    });

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to analyze transcript',
      details: message
    });
  }
});

export default router;
