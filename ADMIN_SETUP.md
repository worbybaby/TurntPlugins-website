# Admin Dashboard Setup

## Overview
A secure admin dashboard has been created at `/admin` route that allows you to:
- View sales statistics and analytics
- See recent orders
- Track plugin popularity
- Export customer emails to CSV
- Monitor download counts

## Security Features
- Password-protected login
- Session-based authentication (browser session storage)
- Environment variable password storage
- Retro Windows 2.0 aesthetic matching your main site

## Setup Instructions

### 1. Local Environment

The admin password has been added to your `.env.local` file:

```
ADMIN_PASSWORD=vuQ7eLUck+n+sauZyFVqghQxMpFH+pTVOioM+Rl+um0=
```

**To access locally:**
1. Run `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Enter the password from `.env.local`

### 2. Production Environment (Vercel)

**Add the admin password to Vercel:**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: `vuQ7eLUck+n+sauZyFVqghQxMpFH+pTVOioM+Rl+um0=`
   - **Environments**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your site for changes to take effect

**To access on production:**
- Navigate to `https://turntplugins.com/admin`
- Enter the password

### 3. Change Your Password (Recommended)

For better security, generate your own password:

```bash
openssl rand -base64 32
```

Then update:
1. `.env.local` (for local development)
2. Vercel environment variables (for production)

## Dashboard Features

### Stats Overview
- **Total Orders**: Total paid + free downloads
- **Total Revenue**: Sum of all paid orders
- **Unique Customers**: Number of unique email addresses
- **Total Downloads**: Number of times plugins were downloaded

### Plugin Popularity
- Visual bar chart showing which plugins are most popular
- Sorted by number of orders

### Recent Orders Table
- Last 50 orders with details:
  - Date
  - Customer email
  - Amount paid
  - Plugins purchased
  - Number of downloads

### Export Emails
- Click "Export Emails" button to download CSV file
- Contains all customer emails with:
  - Email address
  - Order date
  - Amount paid
  - Plugins purchased
  - Order type (Free/Paid)

## Security Notes

### Current Implementation (Basic Security)
- Password stored in environment variable
- Client-side session storage for login state
- Simple password comparison

### For Production (Recommended Upgrades)
If you want to enhance security further:
1. **Add rate limiting** to prevent brute force attacks
2. **Use JWT tokens** instead of session storage
3. **Add IP whitelisting** to restrict access to specific IPs
4. **Enable 2FA** for additional security
5. **Add audit logging** to track admin actions

The current implementation is secure for a small business site with a strong password. The password is:
- Not exposed in client-side code
- Stored as environment variable
- Required for every API call
- Session-based (requires re-login after closing browser)

## Troubleshooting

**Can't access admin page:**
- Check that `ADMIN_PASSWORD` is set in environment variables
- Verify password is correct (no extra spaces)
- Clear browser session storage and try again
- Check Vercel deployment logs for errors

**Stats not loading:**
- Verify Vercel Postgres is connected
- Check that orders exist in database
- Look at browser console for errors
- Check Vercel function logs

**Export not working:**
- Ensure you're logged in
- Check browser allows file downloads
- Verify database has orders to export

## Access URLs

- **Local**: http://localhost:3000/admin
- **Production**: https://turntplugins.com/admin

## File Structure

```
app/
├── admin/
│   └── page.tsx                    # Admin dashboard UI
├── api/
│   └── admin/
│       ├── auth/route.ts           # Login authentication
│       ├── stats/route.ts          # Get dashboard stats
│       └── export-emails/route.ts  # CSV export
middleware.ts                       # API route protection
```

## Support

If you need help or want to add features to the admin dashboard, I can help you:
- Add more analytics
- Create custom reports
- Add filtering/search
- Export to different formats
- Add more security features
