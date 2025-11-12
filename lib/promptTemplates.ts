export const SYSTEM_PROMPT = `You are an AI Relationship Manager assistant for a CRM system. 
Your role is to analyze customer data (contacts, deals, activities, call transcripts) and provide actionable insights.
Be concise, professional, and data-driven in your analysis.
Focus on relationship health, deal risk factors, and recommended next actions.`;

export function buildRelationshipHealthPrompt(context: string): string {
  return `${context}

Based on this contact's history, analyze their relationship health.
Consider: activity frequency, deal progress, response patterns, and engagement level.
Provide a brief assessment (2-3 sentences) and rate the relationship health as: Strong, Good, Fair, or At Risk.`;
}

export function buildDealRiskPrompt(context: string): string {
  return `${context}

Analyze this deal for risk factors.
Consider: deal stage duration, activity patterns, contact engagement, and deal size vs progress.
Provide a risk assessment (2-3 sentences) and rate the risk level as: Low, Medium, or High.`;
}

export function buildNextActionPrompt(context: string): string {
  return `${context}

Based on the contact's recent activity and deal status, recommend the next best action.
Be specific and actionable (1-2 sentences).
Focus on what would most effectively move the relationship or deal forward.`;
}

export function buildContextualResearchPrompt(context: string): string {
  return `${context}

Based on this contact's information and interaction history, provide comprehensive contextual research:

1. **Company & Role Insights:**
   - Key background points about their company
   - Industry trends affecting their business
   - What their role/position typically cares about

2. **Conversation Starters (3-5):**
   - Relevant topics based on past interactions
   - Industry news or events they might find interesting
   - Questions that show you understand their business

3. **Relationship Deepening:**
   - Personal touches or references from past conversations
   - Common ground or shared interests (if mentioned)
   - Topics that could build rapport

4. **Research Recommendations:**
   - What you should research before next interaction
   - Competitor analysis or market intelligence to gather
   - Specific questions to ask to learn more

5. **Strategic Value:**
   - How this contact could become a champion/advocate
   - Cross-sell or expansion opportunities
   - Long-term relationship building strategy

Be specific and reference actual data from their history. Focus on making the next interaction meaningful and personalized.`;
}

export function buildCallAnalysisPrompt(transcript: string, summary?: string): string {
  const contextParts = [
    summary ? `Call Summary: ${summary}` : '',
    `Full Transcript:\n${transcript}`
  ].filter(Boolean);

  return `${contextParts.join('\n\n')}

Analyze this sales call and provide:
1. Key Topics Discussed (bullet points)
2. Customer Sentiment (Positive/Neutral/Negative with brief reason)
3. Action Items (what needs to be done next)
4. Red Flags (any concerns or objections)

Keep your analysis concise and actionable.`;
}
