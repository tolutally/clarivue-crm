# Proxy Error Troubleshooting Guide

## Common Vite Proxy Errors & Solutions

### Error: `[vite] http proxy error: /api/analyze-contact`

This error means the Vite dev server cannot reach the backend API server.

---

## ✅ Solution Checklist

### 1. **Check Backend Server is Running**

```bash
# Check if port 3001 is in use
lsof -i :3001

# Or test the health endpoint
curl http://localhost:3001/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2025-11-12T..."}
```

**If backend is NOT running:**
```bash
npm run backend:dev
```

---

### 2. **Verify Environment Variables**

The backend needs these variables in `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-your-openai-key
```

**Check if variables are loaded:**
```bash
# The backend will show this on startup:
✅ Supabase client initialized for backend
🚀 AI Backend server running on http://localhost:3001
```

**If you see "Missing Supabase environment variables":**
- Make sure `.env.local` exists in project root
- Check variable names are exactly: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- No extra spaces or quotes around values

---

### 3. **Check Vite Proxy Configuration**

File: `vite.config.ts`

```typescript
server: {
  port: 5175,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
      ws: true,
    },
  },
}
```

**This means:**
- Frontend: `http://localhost:5175`
- Backend: `http://localhost:3001`
- API calls to `/api/*` are proxied to backend

---

### 4. **Test the Proxy**

**From frontend (via proxy):**
```bash
curl http://localhost:5175/api/health
```

**Direct to backend:**
```bash
curl http://localhost:3001/api/analyze-contact \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"contactId": "test", "analysisType": "relationship"}'
```

---

## 🚀 Quick Start (Recommended)

### Option 1: Automated Startup Script
```bash
./start.sh
```

This script:
- Checks for `.env.local`
- Starts backend server
- Waits for backend to be ready
- Starts frontend
- Shows all URLs

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
npm run backend:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Test:**
```bash
npm run health
```

---

## 🔍 Debugging Steps

### Step 1: Check Backend Logs
Look for errors in the backend terminal:
```
✅ Supabase client initialized for backend
🚀 AI Backend server running on http://localhost:3001
```

### Step 2: Check Frontend Console
Open browser DevTools → Console:
- Should see proxy logs when clicking AI buttons
- Network tab should show `/api/analyze-contact` requests

### Step 3: Check Vite Logs
The Vite terminal should show:
```
Sending Request to the Target: POST /api/analyze-contact
Received Response from the Target: 200 /api/analyze-contact
```

### Step 4: Test Direct Backend Access
```bash
curl -X POST http://localhost:3001/api/analyze-contact \
  -H "Content-Type: application/json" \
  -d '{
    "contactId": "123",
    "analysisType": "next-action"
  }'
```

---

## 🐛 Common Issues

### Issue: "ECONNREFUSED" error

**Cause:** Backend not running

**Solution:**
```bash
npm run backend:dev
```

---

### Issue: "Missing Supabase environment variables"

**Cause:** `.env.local` doesn't exist or missing variables

**Solution:**
```bash
# Create .env.local
cp .env.example .env.local

# Edit and add your credentials
nano .env.local
```

---

### Issue: "Connection error" from OpenAI

**Cause:** Network issue or invalid API key

**Solutions:**
1. Check internet connection
2. Verify `OPENAI_API_KEY` in `.env.local`
3. Test with: `npm run test:openai`

---

### Issue: Proxy works but gets 404

**Cause:** Incorrect API endpoint path

**Solution:**
Check that backend route matches frontend call:
- Frontend: `/api/analyze-contact`
- Backend: `router.post('/analyze-contact', ...)`

---

### Issue: CORS errors

**Cause:** Direct backend access instead of using proxy

**Solution:**
Make sure frontend uses relative URLs:
```typescript
// ✅ Correct (uses proxy)
fetch('/api/analyze-contact', ...)

// ❌ Wrong (direct access, causes CORS)
fetch('http://localhost:3001/api/analyze-contact', ...)
```

---

## 📊 Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5175 | http://localhost:5175 |
| Backend (Express) | 3001 | http://localhost:3001 |
| Health Check | 3001 | http://localhost:3001/health |

---

## 🔧 Advanced Debugging

### Enable Verbose Proxy Logging

Add to `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    configure: (proxy, _options) => {
      proxy.on('error', (err, _req, _res) => {
        console.log('🔴 Proxy error:', err);
      });
      proxy.on('proxyReq', (proxyReq, req, _res) => {
        console.log('🔵 Sending:', req.method, req.url);
      });
      proxy.on('proxyRes', (proxyRes, req, _res) => {
        console.log('🟢 Received:', proxyRes.statusCode, req.url);
      });
    },
  },
}
```

### Check All Services Status
```bash
# Backend
curl -s http://localhost:3001/health

# Frontend
curl -s http://localhost:5175

# Proxy
curl -s http://localhost:5175/api/health
```

---

## ✅ Verification Checklist

Before using the AI features:

- [ ] `.env.local` exists with all variables
- [ ] Backend running: `lsof -i :3001` shows output
- [ ] Frontend running: `lsof -i :5175` shows output
- [ ] Health check works: `curl http://localhost:3001/health`
- [ ] Proxy works: `curl http://localhost:5175/api/health`
- [ ] No console errors in browser DevTools
- [ ] Vite shows proxy logs when making requests

---

## 🎯 Quick Fix Summary

**Most proxy errors are fixed by:**

1. **Start the backend:**
   ```bash
   npm run backend:dev
   ```

2. **Wait for it to start** (look for):
   ```
   🚀 AI Backend server running on http://localhost:3001
   ```

3. **Test it works:**
   ```bash
   curl http://localhost:3001/health
   ```

4. **Restart frontend** (if already running):
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

5. **Try AI features** in the browser

---

## 📞 Still Having Issues?

Check the logs in this order:

1. **Backend Terminal** - Look for startup errors
2. **Frontend Terminal** - Look for proxy errors
3. **Browser Console** - Look for network errors
4. **Network Tab** - Check request/response details

Most issues are solved by ensuring the backend is running before starting the frontend!
