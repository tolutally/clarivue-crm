# Network & OpenAI Connection Troubleshooting

## Problem: OpenAI Connection Errors

### Symptoms
```
APIConnectionError: Connection error
Error: read ECONNRESET
curl: (35) Recv failure: Connection reset by peer
```

### Root Cause
Your network cannot reach OpenAI's API servers (`api.openai.com`). This can happen due to:

1. **No internet connection**
2. **Firewall/VPN blocking** HTTPS requests to OpenAI
3. **Corporate network restrictions**
4. **ISP blocking** OpenAI endpoints
5. **Network instability**

## Solutions

### Option 1: Use Mock AI Mode (Quick Fix) ✅

Enable mock responses for testing without OpenAI:

```bash
# Add to .env.local
USE_MOCK_AI=true
```

Restart backend:
```bash
npm run backend:dev
```

Now your AI features will return sample responses instantly without needing OpenAI connection.

**Mock responses include:**
- ✅ Smart Engagement Tips
- ✅ Relationship Health Score
- ✅ Contextual Research

**Note:** Mock responses are generic examples, not real AI analysis. Use this for UI/UX testing only.

### Option 2: Fix Network Connection

#### Test OpenAI Connection
```bash
curl -I https://api.openai.com
```

**Expected (working):**
```
HTTP/2 200
```

**Error (not working):**
```
curl: (35) Recv failure: Connection reset by peer
```

#### Troubleshooting Steps

1. **Check internet connection**
   ```bash
   ping google.com
   ```

2. **Try without VPN**
   - Disconnect from VPN
   - Test OpenAI connection again

3. **Check firewall settings**
   - macOS: System Preferences > Security & Privacy > Firewall
   - Allow outbound HTTPS connections

4. **Try different network**
   - Switch to mobile hotspot
   - Try different WiFi network

5. **Check if OpenAI is down**
   - Visit: https://status.openai.com

6. **Test with curl**
   ```bash
   curl -X POST https://api.openai.com/v1/chat/completions \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
   ```

### Option 3: Use Proxy (Advanced)

If you're behind a corporate firewall:

```bash
# Set proxy in .env.local
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port
```

## Switching Between Mock and Real AI

### Enable Mock Mode
```bash
# .env.local
USE_MOCK_AI=true
```
- Fast responses (instant)
- No OpenAI API calls
- Generic sample data
- Free (no API costs)

### Disable Mock Mode (Use Real OpenAI)
```bash
# .env.local
USE_MOCK_AI=false
# or remove the line entirely
```
- Real AI analysis
- Personalized insights
- Requires working internet
- Uses OpenAI API credits

## Logs & Diagnostics

### Backend logs show:
```
🤖 Using MOCK AI mode (network unavailable)
```
→ Mock mode is active

```
🤖 Calling OpenAI API...
✅ OpenAI analysis complete
```
→ Real OpenAI connection working

```
OpenAI API error: APIConnectionError: Connection error
⚠️  Network connectivity issue detected.
💡 Tip: Set USE_MOCK_AI=true in .env.local
```
→ Network issue, use mock mode

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNRESET` | Network dropped connection | Check internet, try VPN off |
| `Connection error` | Cannot reach OpenAI | Enable mock mode or fix network |
| `fetch failed` | Network timeout | Check firewall settings |
| `APIConnectionError` | Generic connection issue | Try different network |

## Performance Note

**Mock Mode:**
- Response time: <10ms (instant)
- No API costs
- Same UI/UX as real AI

**Real OpenAI (gpt-4o-mini):**
- Response time: 500-2000ms
- API costs: ~$0.0001 per request
- Personalized, context-aware insights

## Testing After Fix

1. Restart backend: `npm run backend:dev`
2. Check logs for: `🤖 Using MOCK AI mode` or `🤖 Calling OpenAI API...`
3. Click AI buttons in UI
4. Should see instant responses (mock) or 1-2s responses (real)

## Need Real AI?

Once network is fixed:

1. Remove or comment out `USE_MOCK_AI=true` from `.env.local`
2. Restart backend
3. Test connection: `curl -I https://api.openai.com`
4. Should see: `HTTP/2 200`
5. AI features now use real OpenAI analysis
