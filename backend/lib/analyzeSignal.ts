import { buildDealContext } from '../lib/buildDealContext';
import { generateCompletion } from '../lib/openaiClient';
import { supabase } from '../lib/supabase';

const SIGNAL_ANALYSIS_PROMPT = `You are an expert sales analyst. Analyze the deal information provided and determine the overall signal/health of this deal.

Provide a DETAILED analysis covering:

1. **Engagement Level**: Assess the frequency and quality of interactions
2. **Buying Signals**: Identify positive indicators or concerns
3. **Timeline & Momentum**: Evaluate deal progression and velocity
4. **Risk Factors**: Highlight any red flags or obstacles
5. **Recommended Actions**: Suggest next steps

Consider:
- Recent activities and engagement patterns
- Contact's buying signals and interest level
- Deal stage progression and timeline
- Any red flags or concerns
- Communication quality and frequency
- Overall momentum and trajectory

Return a JSON response with this EXACT structure (no markdown, no code blocks):
{
  "signal": "positive" | "neutral" | "negative",
  "rationale": "3-5 paragraph detailed analysis covering all aspects above. Be specific and reference actual data from the deal context."
}

Rules:
- "positive": Strong buying signals, active engagement, progressing well
- "neutral": Moderate engagement, unclear direction, needs more data
- "negative": Stalled, disengagement, significant concerns

Be detailed, specific, and actionable. Reference actual activities, dates, and context from the deal data.`;

export interface SignalAnalysisResult {
  signal: 'positive' | 'neutral' | 'negative';
  rationale: string;
}

/**
 * Analyzes a deal and updates its signal based on AI analysis of all available context
 */
export async function analyzeAndUpdateDealSignal(dealId: string): Promise<SignalAnalysisResult> {
  console.log(`🎯 Analyzing signal for deal: ${dealId}`);
  
  try {
    // Build comprehensive deal context
    const context = await buildDealContext(dealId);
    console.log(`📊 Deal context built (${context.length} characters)`);
    
    // Get AI analysis
    const response = await generateCompletion({
      systemPrompt: SIGNAL_ANALYSIS_PROMPT,
      userPrompt: `Analyze this deal and determine its signal:\n\n${context}`,
      temperature: 0.3, // Lower temperature for more consistent analysis
      maxTokens: 800, // Increased for detailed analysis
    });
    
    console.log(`🤖 AI response: ${response}`);
    
    // Parse the response
    let analysis: SignalAnalysisResult;
    try {
      // Try to parse as JSON first
      analysis = JSON.parse(response.trim());
      
      // Validate the structure
      if (!analysis.signal || !analysis.rationale) {
        throw new Error('Invalid response structure');
      }
      
      // Validate signal value
      if (!['positive', 'neutral', 'negative'].includes(analysis.signal)) {
        throw new Error(`Invalid signal value: ${analysis.signal}`);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.log('Raw response:', response);
      
      // Fallback: extract signal and rationale with regex
      const signalMatch = response.match(/"signal":\s*"(positive|neutral|negative)"/);
      const rationaleMatch = response.match(/"rationale":\s*"([^"]+)"/);
      
      if (signalMatch && rationaleMatch) {
        analysis = {
          signal: signalMatch[1] as 'positive' | 'neutral' | 'negative',
          rationale: rationaleMatch[1],
        };
      } else {
        // Ultimate fallback
        analysis = {
          signal: 'neutral',
          rationale: 'Unable to fully analyze deal signal. Please review manually.',
        };
      }
    }
    
    console.log(`✅ Signal determined: ${analysis.signal} - ${analysis.rationale}`);
    
    // Update the deal in the database
    const { error } = await supabase
      .from('deals')
      .update({
        signal: analysis.signal,
        signal_rationale: analysis.rationale,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dealId);
    
    if (error) {
      console.error('❌ Error updating deal signal:', error);
      throw new Error(`Failed to update deal signal: ${error.message}`);
    }
    
    console.log(`✅ Deal signal updated in database`);
    
    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing deal signal:', error);
    throw error;
  }
}
