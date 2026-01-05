# Meta Ads Manager - Quick Setup for Rubber.PRE A/B Test

## Current Settings (from your screenshot)

### ✅ A/B Test: ON
**Status:** Correct

### ⚠️ What to test: Creative
**Status:** Correct - You're testing different videos
**Note:** This is the right choice for comparing multiple video ads

### ✅ Test Duration: 7 days
**Status:** Needs adjustment for your budget
**Recommendation:** Change to **14 days** minimum
**Why:** At $15/day budget, you need more time to gather meaningful data

### ⚠️ Performance Comparison: Cost per post engagement
**Status:** Wrong metric for plugin sales
**Recommendation:** Change to one of these:

1. **Cost per link click** (safest option, measures interest)
2. **Cost per landing page view** (better - confirms they loaded your page)
3. **Cost per conversion/purchase** (best - but requires Meta Pixel setup)

**Why the change?**
- "Post engagement" = likes, comments, shares
- You want SALES, not just social engagement
- Post engagement might look good but produce zero sales

---

## Step-by-Step Configuration

### In Meta Ads Manager:

#### 1. Campaign Level
```
Campaign Objective: Sales (or Traffic if pixel not set up)
Campaign Name: Rubber.PRE - Creative Test
Campaign Budget: $15/day
```

#### 2. Enable A/B Test
- Toggle ON ✓
- **What to test:** Creative
- **Test duration:** 14 days
- **How to compare:** Cost per purchase (or Cost per link click)

#### 3. Ad Set Level (Create ONE ad set)
```
Ad Set Name: Rubber.PRE - Video Test
Conversion Event: Purchase (or Landing Page View)

TARGETING:
- Location: United States (or your target markets)
- Age: 18-45
- Gender: All
- Detailed Targeting:
  → Music production
  → Audio engineering
  → Ableton Live
  → Logic Pro
  → Recording studio
  → Vintage audio

Placements: Automatic (let Meta optimize)
Budget: $15/day
```

#### 4. Ad Level (Create TWO ads in the SAME ad set)
```
Ad 1:
  Name: Rubber.PRE - Variant A
  Video: [Upload your first video]
  Primary Text: [Your ad copy]
  Headline: Get Rubber.PRE - $35
  Description: Grainy crunch for indie guitar tones
  Call to Action: Shop Now
  Website URL: [Your product page]

Ad 2:
  Name: Rubber.PRE - Variant B
  Video: [Upload your second video]
  Primary Text: [Same or different copy]
  Headline: Get Rubber.PRE - $35
  Description: Grainy crunch for indie guitar tones
  Call to Action: Shop Now
  Website URL: [Your product page]
```

---

## ⚠️ CRITICAL: Do NOT Create Multiple Ad Sets

**WRONG WAY:**
```
❌ Ad Set 1 → Ad Variant A ($7.50/day)
❌ Ad Set 2 → Ad Variant B ($7.50/day)
```

**RIGHT WAY:**
```
✅ Ad Set 1 → Ad Variant A + Ad Variant B ($15/day total)
   Meta will split the budget automatically
```

**Why?** Meta's A/B test tool needs both ads in the same ad set to properly compare them.

---

## Settings Checklist Before Publishing

### Campaign Level
- [ ] Objective: Sales or Traffic
- [ ] A/B test: ON
- [ ] What to test: Creative
- [ ] Duration: 14 days
- [ ] Comparison: Cost per link click (or better metric)

### Ad Set Level
- [ ] Only ONE ad set created
- [ ] Budget: $15/day
- [ ] Targeting set up (music producers)
- [ ] Placements: Automatic

### Ad Level
- [ ] TWO ads created in the same ad set
- [ ] Both videos uploaded and encoded
- [ ] Ad copy written
- [ ] URL includes UTM parameters
- [ ] Both ads use same CTA button
- [ ] Preview looks good on mobile

### Tracking Setup
- [ ] Meta Pixel installed on website (if measuring purchases)
- [ ] Purchase event firing correctly
- [ ] Test with Pixel Helper extension
- [ ] UTM parameters added to URLs

---

## Sample Ad Copy for Rubber.PRE

### Primary Text (Hook + Value Prop)
```
Indie guitarists: Stop chasing that elusive grainy, lofi tone.

Rubber.PRE is a circuit-accurate 4-track tape preamp that gives you
authentic 90s indie rock crunch in seconds. No more plugin stacking.

Hit the rubber button for instant vintage grit ✅
Level-matched so you can trust your ears ✅
Works on guitars, vocals, drums—everything ✅

$35 (or pay what you want, minimum $15)
```

### Headline Options
- "Get That Indie Guitar Tone - $35"
- "Rubber.PRE: Authentic Tape Crunch"
- "Stop Plugin Stacking. Use Rubber.PRE"
- "Grainy Lofi Tones in One Click"

### Description
"Circuit-accurate tape preamp. AU/VST3 Mac & Windows."

---

## What Happens When You Launch

### First 24 hours:
- Meta learns about your audience
- Delivery may be uneven
- Don't judge performance yet
- Check for delivery issues

### Days 2-7 (Learning Phase):
- Algorithm optimizes delivery
- More stable performance data
- Start seeing patterns
- Still too early to call winner

### Days 8-14 (Decision Time):
- Clear patterns emerge
- Can identify winning variant
- Ready to make decisions
- Prepare to scale winner

---

## Red Flags to Watch For

🚩 **Frequency over 3.0:** Audience is too small or ad fatigue setting in
🚩 **CTR under 0.5%:** Video hook isn't working, creative needs improvement
🚩 **High clicks, no purchases:** Landing page issue or price objection
🚩 **One variant not spending:** Delivery issue, check for disapprovals
🚩 **CPC over $3:** Audience too competitive or creative not engaging

---

## Quick Reference: Where to Find Metrics

In Ads Manager, customize columns to show:
- Amount Spent
- Impressions
- Reach
- Link Clicks
- CTR (link click-through rate)
- CPC (cost per link click)
- Landing Page Views
- Purchases (if pixel set up)
- Cost per Purchase
- ROAS

**How:** Click "Columns: Performance" → "Customize Columns" → Add metrics

---

## Need Help?

### Common Issues:
1. **Video won't upload:** Check file size (< 4GB) and format (MP4/MOV)
2. **Ad disapproved:** Avoid "before/after" medical claims, check ad policy
3. **Low delivery:** Audience may be too narrow, broaden targeting
4. **High costs:** Test different audiences or creative hooks

### Resources:
- [Meta Events Manager](https://business.facebook.com/events_manager2) (for pixel)
- [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper)
- [Meta Ad Library](https://www.facebook.com/ads/library/) (spy on competitors)
