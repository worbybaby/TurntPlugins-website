# Vercel Deployment - Remaining Tasks

## Context
We are deploying the TurntPlugins website to Vercel. The site includes:
- Next.js 15.5.4 with pay-what-you-want plugin store
- Stripe integration for payments
- Vercel Postgres for order tracking
- Vercel Blob for plugin file hosting
- Resend for email delivery
- Download delivery system with 3-day expiration

## Current Status
- Repository: `worbybaby/TurntPlugins-website`
- Branch: `main`
- Latest commit: `8b37149` (includes Stripe API version fix)
- Vercel project created but deployment may still be in progress
- Root directory: **LEFT BLANK** (important!)
- Environment variables added so far:
  - ✅ `STRIPE_SECRET_KEY` (rotated key, 7-day expiration)
  - ✅ `RESEND_API_KEY`

## Plugin Files Location
Local path: `/Volumes/Samsung_T5/plugin_dev/tests/new-plugin-time/Current Installers`

Files to upload:
- Cassette Tapeworm_v1.0.2_macOS.pkg
- Cassette Tapeworm_v1.0.2_Windows.exe
- Phat Phaser_v1.0.3_macOS.pkg
- Phat Phaser_v1.0.3_Windows.exe
- Rotary Speaker_v1.0.0_macOS.pkg
- Rotary Speaker_v1.0.0_Windows.exe

---

## Remaining Tasks (In Order)

### 1. Verify Deployment Success
- Go to Vercel Deployments tab
- Check that latest deployment used commit `8b37149`
- Verify build succeeded (no errors)
- Copy the production URL (something like `https://turnt-plugins-website.vercel.app`)

### 2. Add Postgres Database
**In Vercel:**
- Go to Storage tab
- Click "Create Database"
- Select "Postgres"
- Follow setup wizard
- After creation, go to project Settings → Environment Variables
- Vercel should auto-add `POSTGRES_URL` - verify it exists

**Initialize Database:**
- The database schema will auto-create on first API call
- Tables: `orders` and `downloads` (see `app/api/lib/db.ts`)

### 3. Add Blob Storage
**In Vercel:**
- Go to Storage tab
- Click "Create Store"
- Select "Blob"
- Follow setup wizard
- After creation, verify `BLOB_READ_WRITE_TOKEN` exists in Environment Variables

**Upload Plugin Files:**
- Use Vercel CLI or dashboard to upload files to Blob storage
- Upload path format: `plugins/{filename}`
- Files must match names in `app/data/pluginFiles.ts`

### 4. Add Remaining Environment Variables
**Add these in Vercel Settings → Environment Variables:**

1. `NEXT_PUBLIC_APP_URL`
   - Value: Your production URL from step 1 (e.g., `https://turnt-plugins-website.vercel.app`)
   - Used for: Download links in emails

2. `STRIPE_WEBHOOK_SECRET`
   - Get from Stripe dashboard after creating webhook (step 5)
   - Used for: Verifying webhook signatures

### 5. Set Up Stripe Webhook
**In Stripe Dashboard:**
- Go to Developers → Webhooks
- Click "Add endpoint"
- Endpoint URL: `https://YOUR-VERCEL-URL.vercel.app/api/webhooks/stripe`
- Select events to listen for:
  - `checkout.session.completed`
- Click "Add endpoint"
- Copy the "Signing secret" (starts with `whsec_`)
- Add to Vercel as `STRIPE_WEBHOOK_SECRET` environment variable

**Important:** After adding webhook secret, redeploy the site in Vercel for env vars to take effect

### 6. Test Full Flow
**Test Payment & Download:**
1. Visit production URL
2. Add a plugin to cart
3. Set payment to $0 or small amount
4. Enter test email
5. Complete checkout
6. Check email for download link
7. Click download link - should redirect to Vercel Blob file
8. Verify "My Downloads" page works with the email

**Test Cases:**
- Free download ($0)
- Paid download (use Stripe test card: 4242 4242 4242 4242)
- Multiple plugins in cart
- Download link expiration (3 days)
- Re-download from "My Downloads" page

---

## Important Notes

### Vercel Deployment Issues Encountered
- Vercel was caching old commits and not auto-deploying
- Solution: Created Deploy Hook to force fresh deployments
- Deploy Hook URL saved in Vercel Settings → Git → Deploy Hooks

### Known File Structure
- Root directory must be **BLANK** in Vercel settings
- Don't use `turnt-plugins-site` as root directory (this caused issues)

### Stripe API Version
- Updated to `2025-09-30.clover` in:
  - `app/api/create-checkout-session/route.ts`
  - `app/api/webhooks/stripe/route.ts`

### Security Features Implemented
- Rate limiting (5 requests/min per IP)
- Input validation (email, payment amounts)
- Max payment: $10,000
- Max cart items: 50
- Security headers (HSTS, XSS protection, CSP)

---

## Troubleshooting

**If deployment fails:**
- Check build logs for specific error
- Verify all environment variables are set
- Try redeploying without cache
- Use Deploy Hook URL to force fresh deployment

**If downloads don't work:**
- Verify Blob storage is set up
- Check plugin files are uploaded to correct paths
- Verify `BLOB_READ_WRITE_TOKEN` environment variable exists
- Check download links aren't expired (3 days)

**If emails don't send:**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for error logs
- Verify email template renders correctly

**If webhook fails:**
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Check webhook endpoint URL is correct
- View webhook logs in Stripe dashboard
- Ensure site was redeployed after adding webhook secret

---

## Next Steps After Deployment

1. Switch Stripe to production mode (currently in test mode)
2. Rotate Stripe API keys to production keys
3. Update webhook with production Stripe account
4. Set up custom domain (user mentioned they have one)
5. Test with real payment
6. Monitor error logs in Vercel dashboard
