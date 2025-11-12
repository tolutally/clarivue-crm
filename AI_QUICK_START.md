# Quick Start Guide - AI Relationship Manager

## 🚀 Get Started in 3 Steps

### Step 1: Create Environment File
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:
```env
# Supabase Configuration (should already be set)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key

# OpenAI Configuration (ADD THIS)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Backend Server
PORT=3001
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

### Step 2: Start the Backend Server
Open a new terminal and run:

```bash
npm run backend:dev
```

You should see:
```
🚀 AI Backend server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
🤖 API endpoints:
   - POST http://localhost:3001/api/analyze-contact
   - POST http://localhost:3001/api/analyze-deal
   - POST http://localhost:3001/api/analyze-transcript
```

### Step 3: Use the AI Features
1. Keep the frontend running: `npm run dev`
2. Navigate to any contact's detail page
3. Scroll down to the "AI Relationship Manager" section
4. Click any of the three "Analyze" buttons:
   - **Smart Engagement Tips** - Get suggestions on next actions
   - **Relationship Health Score** - Assess relationship strength
   - **Contextual Research** - Get conversation starters

## 📝 Features Overview

### Smart Engagement Tips (Amber)
- When to reach out next
- Best communication channel to use
- Specific action recommendations

### Relationship Health Score (Green)
- Overall relationship rating (Strong/Good/Fair/At Risk)
- Analysis of interaction patterns
- Opportunity identification

### Contextual Research (Purple)
- Background research on recent activities
- Conversation starter suggestions
- Relevant topics to discuss

## ⚠️ Troubleshooting

**Backend won't start?**
- Make sure `.env` file exists with `OPENAI_API_KEY`
- Check if port 3001 is already in use
- Verify OpenAI API key is valid

**"Failed to get [feature]" error?**
- Ensure backend server is running (`npm run backend:dev`)
- Check browser console for detailed errors
- Verify backend is accessible at http://localhost:3001

**Empty or unhelpful AI responses?**
- Add more activities to the contact
- Create deals associated with the contact
- Ensure contact has recent interaction history

## 💰 Cost Information

Each AI analysis costs approximately **$0.09** using GPT-4.

To reduce costs:
- Analyses are triggered manually (not automatic)
- Results stay visible until page refresh
- Consider implementing caching for frequently analyzed contacts

## 🎯 What's Next?

The system is ready to use! Here are some suggested next steps:

1. **Test with different contacts** - See how AI adapts to various scenarios
2. **Add more contact data** - More activities = better insights
3. **Review AI prompts** - Customize in `/backend/lib/promptTemplates.ts`
4. **Add caching** - Store results to reduce API calls
5. **Integrate with deals** - Use the deal analysis endpoint

## 📚 Documentation

- **Backend API:** See `AI_BACKEND_README.md`
- **Frontend Integration:** See `AI_FRONTEND_INTEGRATION.md`
- **Transcript Feature:** See `TRANSCRIPT_FEATURE.md`

## 🎉 You're All Set!

The AI Relationship Manager is now fully operational. Start analyzing your contacts to get intelligent insights powered by GPT-4!
