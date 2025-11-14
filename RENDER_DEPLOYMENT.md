# Render Deployment Configuration

## Deployment Strategy

Deploy as two separate services on Render:

1. **Backend Web Service** - Express API server
2. **Frontend Static Site** - Vite-built React app

---

## Backend Web Service Setup

### Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `tolutally/clarelations`
4. Configure the service:

**Service Details:**
- **Name**: `clarelations-api` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave blank (uses repo root)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm run backend`

**Environment Variables:**
- `OPENAI_API_KEY`: Your OpenAI API key
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `PORT`: `10000` (Render's default, but it sets this automatically)
- `NODE_ENV`: `production`

**Plan**: Free or paid depending on needs

### Step 2: Note Your Backend URL

After deployment, Render will give you a URL like:
```
https://clarelations-api.onrender.com
```

**Important**: Copy this URL - you'll need it for the frontend!

---

## Frontend Static Site Setup

### Step 1: Update Frontend API Calls

Before deploying frontend, update the API base URL to point to your Render backend.

Create `lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export { API_BASE_URL };
```

Then update `actions/createActivity.ts`:
```typescript
import { API_BASE_URL } from '../lib/api';

// Change this line:
fetch('/api/analyze-deal-signal', ...)

// To:
fetch(`${API_BASE_URL}/api/analyze-deal-signal`, ...)
```

### Step 2: Create Static Site on Render

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository: `tolutally/clarelations`
4. Configure the site:

**Site Details:**
- **Name**: `clarelations` (or your choice)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

**Environment Variables:**
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_API_URL`: `https://clarelations-api.onrender.com` (your backend URL)

### Step 3: Configure Redirects

Create `render.yaml` in your repo root for proper SPA routing.

---

## Quick Deploy Commands

### Option A: Deploy via Render Dashboard (Recommended)
Follow the steps above in the Render UI.

### Option B: Deploy via render.yaml

Create `render.yaml` in repo root with both services defined (see below).

---

## Important Notes

### Free Tier Limitations
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider keeping backend alive with a health check ping

### CORS Configuration
Your backend already has CORS enabled, but verify in `backend/server.ts` that it allows your frontend domain.

### Environment Variables
- Set in Render Dashboard for each service
- Frontend vars must start with `VITE_`
- Backend vars can be any name

### Monitoring
- Check logs in Render Dashboard
- Monitor API response times
- Set up alerts for failures

---

## Deployment Checklist

### Backend:
- [ ] Create Web Service on Render
- [ ] Set environment variables (OPENAI_API_KEY, etc.)
- [ ] Deploy and verify health check works
- [ ] Copy backend URL

### Frontend:
- [ ] Update API calls to use backend URL
- [ ] Create Static Site on Render
- [ ] Set environment variables (VITE_API_URL, etc.)
- [ ] Deploy and test

### Verification:
- [ ] Open frontend URL
- [ ] Test login/authentication
- [ ] Create a deal and verify signal analysis works
- [ ] Check browser console for API errors
- [ ] Test all AI features (chat, analysis, etc.)

---

## Troubleshooting

**Backend doesn't start:**
- Check logs in Render Dashboard
- Verify all environment variables are set
- Make sure `npm run backend` works locally

**Frontend can't reach backend:**
- Check VITE_API_URL is set correctly
- Verify CORS is enabled in backend
- Check Network tab in browser DevTools

**API calls timeout:**
- Backend may be spinning up (free tier)
- Check backend logs for errors
- Verify OpenAI API key is valid

**Build fails:**
- Check Node version compatibility
- Verify package.json scripts are correct
- Check build logs for missing dependencies
