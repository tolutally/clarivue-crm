# Invite-Only Access Control

## Overview

Your Clarelations app now has **invite-only access control**. Only emails you explicitly authorize can sign in.

## How It Works

Before sending a magic link, the app checks if the email is in your allowlist. If not authorized, users see:
> "This email is not authorized to access the system. Please contact an administrator."

## Configuration

### Local Development

Edit `.env.local`:

```bash
# Allow specific emails (comma-separated)
VITE_ALLOWED_EMAILS=john@company.com,jane@company.com,admin@example.com

# Or allow entire domains
VITE_ALLOWED_EMAILS=@yourcompany.com,@partner.com

# Or mix both
VITE_ALLOWED_EMAILS=freelancer@gmail.com,@yourcompany.com
```

### Production (Vercel)

1. Go to your Vercel dashboard: https://vercel.com/tolutally-pro/clarelations
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `VITE_ALLOWED_EMAILS`
   - **Value:** `your@email.com,colleague@company.com,@yourcompany.com`
   - **Environment:** Production (and Preview if needed)
4. Click **Save**
5. Redeploy your app

## Allowlist Formats

### 1. Specific Email Addresses
```bash
VITE_ALLOWED_EMAILS=alice@example.com,bob@example.com
```
Only these exact emails can sign in.

### 2. Entire Domains
```bash
VITE_ALLOWED_EMAILS=@yourcompany.com,@partner.com
```
Anyone with an email from these domains can sign in.

### 3. Mixed
```bash
VITE_ALLOWED_EMAILS=contractor@gmail.com,@yourcompany.com,@client.com
```
The contractor AND anyone from yourcompany.com or client.com domains.

## Open Access (Not Recommended for Production)

To allow anyone to sign in (remove restrictions):
- Don't set `VITE_ALLOWED_EMAILS`, or
- Set it to empty: `VITE_ALLOWED_EMAILS=`

## Visual Indicators

When an allowlist is configured, users see:
- 🛡️ **"Invite-only access"** badge on the login screen
- Clear error message if their email isn't authorized

## Managing Access

### Add a New User
1. Add their email to `VITE_ALLOWED_EMAILS`
2. Redeploy (Vercel) or restart dev server (local)
3. Notify them they can now sign in

### Add a Whole Team
1. Add their domain: `@newcompany.com`
2. Redeploy
3. All team members with that domain can now sign in

### Remove Access
1. Remove their email/domain from the list
2. Redeploy
3. They won't be able to request new magic links (existing sessions will expire naturally)

## Security Notes

✅ **Client-side validation** - Fast feedback for users  
⚠️ **Also implement server-side** - For maximum security, add Supabase Edge Functions or RLS policies  
✅ **Case-insensitive** - Works with any capitalization  
✅ **Flexible** - Supports exact emails and domain wildcards  

## Example Scenarios

### Small Team
```bash
VITE_ALLOWED_EMAILS=founder@startup.com,cto@startup.com,ceo@startup.com
```

### Company-Wide Access
```bash
VITE_ALLOWED_EMAILS=@yourcompany.com
```

### Multi-Organization
```bash
VITE_ALLOWED_EMAILS=@yourcompany.com,@partner1.com,@partner2.com
```

### Mixed Internal + External
```bash
VITE_ALLOWED_EMAILS=@yourcompany.com,consultant@gmail.com,advisor@hotmail.com
```

## Troubleshooting

**User says they can't sign in:**
1. Check if their email is in the allowlist
2. Check for typos in the domain/email
3. Remember to redeploy after changes
4. Verify case doesn't matter (alice@X.com = Alice@x.com)

**How to check current allowlist in production:**
- In Vercel dashboard → Settings → Environment Variables
- Look for `VITE_ALLOWED_EMAILS`

**Changes not taking effect:**
- Local: Restart `npm run dev`
- Production: Redeploy with `vercel --prod`

---

🔒 Your app is now invite-only! Only authorized users can access it.
