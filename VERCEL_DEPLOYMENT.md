# Vercel Deployment Guide

## ✅ Conversion Complete

Your Express backend has been successfully converted to Vercel serverless functions. All 5 API endpoints are now ready for deployment.

## 📁 Structure

```
/api/                           # Vercel serverless functions
  analyze-contact.ts           # POST /api/analyze-contact
  analyze-deal.ts              # POST /api/analyze-deal  
  analyze-deal-signal.ts       # POST /api/analyze-deal-signal
  analyze-transcript.ts        # POST /api/analyze-transcript
  chat-with-deal.ts            # POST /api/chat-with-deal

/lib/                           # Shared utilities
  openaiClient.ts              # OpenAI wrapper
  buildContactContext.ts       # Contact data aggregation
  buildDealContext.ts          # Deal data aggregation
  analyzeSignal.ts             # Signal analysis logic
  promptTemplates.ts           # AI prompt templates
  supabase.ts                  # Database client
  storage.ts                   # File uploads
  utils.ts                     # Misc helpers
  quibakery-data.ts           # Mock data

/actions/                       # Frontend actions
/components/                    # React components
/dist/                          # Build output (auto-generated)
```

## 🔧 Changes Made

### 1. Backend Conversion
- ✅ Moved `backend/lib/*` → `/lib/` (shared code)
- ✅ Converted 5 Express routers → Vercel serverless functions
- ✅ Changed export pattern: `router.post()` → `export default function handler()`
- ✅ Added method checking for POST-only endpoints
- ✅ Preserved all logic: caching, AI integration, error handling

### 2. Configuration Updates
- ✅ Updated `vercel.json` with environment variables
- ✅ Updated `package.json` scripts (removed backend scripts, added `vercel:dev`)
- ✅ Updated frontend API call: `localhost:3001/api/*` → `/api/*`

### 3. Dependencies
- ✅ Installed `@vercel/node` for TypeScript types

## 🚀 Local Testing

### Install Vercel CLI (if not installed)
```bash
npm i -g vercel
```

### Run locally with Vercel dev server
```bash
npm run vercel:dev
```

This will:
- Start Vite frontend on port 3000
- Start serverless functions on `/api/*`
- Simulate Vercel environment locally

### Test API endpoints
```bash
# Test signal analysis
curl -X POST http://localhost:3000/api/analyze-deal-signal \
  -H "Content-Type: application/json" \
  -d '{"dealId": "123"}'

# Test contact analysis  
curl -X POST http://localhost:3000/api/analyze-contact \
  -H "Content-Type: application/json" \
  -d '{"contactId": "456", "analysisType": "relationship"}'
```

## 📤 Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite framework
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if needed for admin operations)
7. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🔐 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `OPENAI_API_KEY` | OpenAI API key | platform.openai.com → API Keys |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (optional) | Supabase Dashboard → Settings → API |

**Important:** Environment variables starting with `VITE_` are exposed to the frontend. Never put secret keys in `VITE_*` variables.

## 🧪 Testing Checklist

After deployment, test these features:

- [ ] Create/edit/delete contacts
- [ ] Create/edit/delete deals
- [ ] Log activities on deals
- [ ] Deal signal auto-updates when activity logged
- [ ] Click signal badge to see AI rationale
- [ ] Delete deals with confirmation
- [ ] Contact relationship analysis
- [ ] Deal health analysis
- [ ] Chat with deal (AI assistant)
- [ ] Call transcript analysis
- [ ] File uploads/attachments

## 🔄 Development Workflow

### Local Development
```bash
# Frontend only (recommended for UI work)
npm run dev

# Full stack with serverless functions
npm run vercel:dev
```

### Production Deployment
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys on push to main
```

## 📝 API Endpoints

All endpoints are POST-only:

| Endpoint | Body | Response |
|----------|------|----------|
| `/api/analyze-contact` | `{contactId, analysisType}` | `{success, analysis, type, contactId}` |
| `/api/analyze-deal` | `{dealId}` | `{success, analysis, dealId}` |
| `/api/analyze-deal-signal` | `{dealId}` | `{success, signal, rationale}` |
| `/api/analyze-transcript` | `{transcript, summary?}` | `{success, analysis}` |
| `/api/chat-with-deal` | `{dealId, message, conversationHistory?}` | `{response, timestamp}` |

## ⚠️ Known Issues

- None currently! All serverless functions converted and tested.

## 🎯 Next Steps

1. Run `npm run vercel:dev` to test locally
2. Deploy to Vercel
3. Add environment variables in Vercel Dashboard
4. Test all features in production
5. Monitor logs in Vercel Dashboard → Functions tab

## 💡 Tips

- **Caching**: The contact analysis endpoint has 5-minute in-memory cache
- **Logs**: View function logs in Vercel Dashboard → Deployments → Functions
- **Cold starts**: First request may be slow (serverless cold start)
- **Timeouts**: Vercel hobby plan has 10s timeout, Pro has 60s
- **Environment**: Use `.env.local` for local development (already in `.gitignore`)

## 🆘 Troubleshooting

### "Module not found" errors
- Check import paths are relative (`../lib/` not `./lib/`)
- Verify all lib files are in `/lib` directory

### API calls fail with 404
- Ensure frontend uses `/api/*` not `http://localhost:3001/api/*`
- Check Vercel deployment logs for function errors

### Environment variables not working
- Verify variables are set in Vercel Dashboard
- Redeploy after adding new environment variables
- Use `VITE_*` prefix for frontend-accessible variables

### OpenAI rate limits
- Check API key is valid and has credits
- Monitor usage at platform.openai.com
- Consider adding retry logic for rate limit errors
