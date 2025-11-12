# 🚀 Quick Start Guide - Running Clarelations

## Prerequisites

- Node.js 18+ installed (Node.js 20+ recommended)
- `.env.local` file with required credentials

## Step 1: Environment Setup

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-key-here
VITE_ALLOWED_EMAILS=your@email.com
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the Application

### Option A: Automated (Recommended)

```bash
./start.sh
```

This automatically starts both frontend and backend.

### Option B: Manual (Two Terminals)

**Terminal 1 - Start Backend:**
```bash
npm run backend:dev
```

Wait for:
```
🚀 AI Backend server running on http://localhost:3001
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

## Step 4: Verify Everything Works

### Test Backend Health
```bash
npm run health
```

or

```bash
curl http://localhost:3001/health
```

### Open Frontend
Navigate to: **http://localhost:5175**

## 🎯 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server (port 5175) |
| `npm run backend:dev` | Start backend API server (port 3001) |
| `npm run test:openai` | Test OpenAI API connection |
| `npm run health` | Check backend health |
| `./start.sh` | Start both frontend & backend |
| `npm run build` | Build for production |
| `npm run typecheck` | Run TypeScript type checking |

## 🔍 Troubleshooting

### "Proxy Error" in Browser

**Cause:** Backend server not running

**Solution:**
```bash
# In a separate terminal
npm run backend:dev
```

### "Missing Supabase environment variables"

**Cause:** `.env.local` not configured

**Solution:**
1. Create `.env.local` from `.env.example`
2. Add your Supabase credentials

### "Connection error" with OpenAI

**Cause:** Invalid or missing OpenAI API key

**Solution:**
1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env.local`: `OPENAI_API_KEY=sk-...`
3. Test with: `npm run test:openai`

### Port Already in Use

**Backend (3001):**
```bash
lsof -i :3001
kill -9 <PID>
```

**Frontend (5175):**
```bash
lsof -i :5175
kill -9 <PID>
```

## 📚 Full Documentation

- **Proxy Issues:** See [PROXY_TROUBLESHOOTING.md](PROXY_TROUBLESHOOTING.md)
- **AI Features:** See [AI_QUICK_START.md](AI_QUICK_START.md)
- **Backend API:** See [AI_BACKEND_README.md](AI_BACKEND_README.md)
- **Improvements:** See [AI_IMPROVEMENTS.md](AI_IMPROVEMENTS.md)

## ✅ Success Indicators

When everything is working:

- **Backend Terminal:**
  ```
  ✅ Supabase client initialized for backend
  🚀 AI Backend server running on http://localhost:3001
  ```

- **Frontend Terminal:**
  ```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5175/
  ```

- **Browser Console:** No errors
- **AI Features:** All three analyze buttons work

## 🎉 You're Ready!

Navigate to **http://localhost:5175** and start using the AI-powered CRM!
