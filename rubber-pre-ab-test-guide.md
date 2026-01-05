# Rubber.PRE A/B Test Setup Guide

## Meta Ads Manager Configuration

### Test Settings
- **Test Type:** Creative (testing different video ads)
- **Duration:** 7 days minimum (10-14 days recommended for better data)
- **Performance Metric:** Choose based on goal:
  - **Cost per Purchase** - Best for sales (requires pixel tracking)
  - **Cost per Landing Page View** - Good for measuring interest
  - **Cost per Link Click** - Basic engagement metric
  - ❌ Cost per Post Engagement - Not ideal for product sales

### Campaign Structure
```
Campaign: Rubber.PRE Launch
  └─ Ad Set: Creative Test
      ├─ Ad Variant A: [Video 1]
      ├─ Ad Variant B: [Video 2]
      └─ Ad Variant C: [Video 3]
```

## Pre-Launch Checklist

### 1. Conversion Tracking Setup
- [ ] Meta Pixel installed on website
- [ ] "Purchase" event tracking configured
- [ ] Test pixel with Pixel Helper extension
- [ ] Add UTM parameters to track variants:
  - Variant A: `?utm_source=facebook&utm_medium=paid&utm_campaign=rubber-pre&utm_content=variant-a`
  - Variant B: `?utm_source=facebook&utm_medium=paid&utm_campaign=rubber-pre&utm_content=variant-b`
  - Variant C: `?utm_source=facebook&utm_medium=paid&utm_campaign=rubber-pre&utm_content=variant-c`

### 2. Landing Page
- [ ] Rubber.PRE product page is live
- [ ] Page loads fast (< 3 seconds)
- [ ] Mobile-optimized
- [ ] Clear CTA (Buy Now button)
- [ ] Price clearly displayed ($35, minimum $15)

### 3. Ad Copy & Creative
- [ ] Videos uploaded for each variant
- [ ] Compelling ad copy written
- [ ] Clear value proposition in first 3 seconds
- [ ] CTA in video or ad copy
- [ ] Consider adding captions (80% watch without sound)

### 4. Audience Settings
**Recommended Targeting:**
- **Interest-based:**
  - Music production
  - Audio engineering
  - Recording studio
  - Ableton Live, Logic Pro, Pro Tools, FL Studio
  - Vintage audio equipment
  - Indie rock, lo-fi music

- **Behavior-based:**
  - Online shoppers
  - Small business owners (indie musicians)

- **Demographics:**
  - Age: 18-45 (music producers skew younger)
  - Location: US, UK, Canada, Australia (English-speaking markets)

### 5. Budget Recommendations ($15/day total)
**IMPORTANT:** With a $15/day budget, test only 2 variants (not 3)
- **Per variant:** $7.50/day each
- **Test duration:** 14 days minimum (21 days recommended)
- **Total test cost:** $210 (14 days) or $315 (21 days)
- **Goal:** At least 30-50 meaningful actions per variant

**Why 2 variants only?**
- $5/day per variant (if testing 3) is too little for Meta's algorithm to optimize
- Need minimum $7-10/day per ad for proper delivery
- Better to get clear data on 2 variants than weak data on 3

## What to Test in Your Videos

### Variant Ideas (Choose your 2 strongest):
1. **Option A:** Feature focus (show the plugin interface, demonstrate controls)
2. **Option B:** Sound comparison (before/after, with/without plugin) - RECOMMENDED
3. **Option C:** Testimonial/lifestyle (producer using it in studio)

**Recommended for first test:** Variant B vs Variant C
- Sound demos typically perform best for plugins
- Testimonial adds social proof and context

### Key Elements:
- Hook in first 3 seconds
- Show the "rubber" button in action
- Demonstrate the "grainy crunch" and "rubbery lofi" tones
- Show use case (indie guitar, vocals, etc.)
- End with clear CTA

## Monitoring & Optimization

### Daily Checks (First 2-3 days):
- [ ] Check spend is distributing evenly
- [ ] Monitor frequency (keep under 2.5)
- [ ] Watch for early winners
- [ ] Check for delivery issues

### Key Metrics to Track:

| Metric | Variant A | Variant B | Winner |
|--------|-----------|-----------|--------|
| Impressions | | | |
| Reach | | | |
| Link Clicks | | | |
| CTR (%) | | | |
| Landing Page Views | | | |
| Purchases | | | |
| Cost per Purchase | | | |
| ROAS | | | |
| Video Avg % Watched | | | |
| **Total Spend** | | | |

### When to Call a Winner:
**With $15/day budget:**
- ✓ At least 30 meaningful actions per variant (clicks, page views, or purchases)
- ✓ Clear winner by 25%+ after 14 days
- ✓ OR one variant has 3x better cost per result
- ✓ Confident the trend is consistent (not just day 1 spike)

**Don't call it too early:** Need at least 7 days of data for algorithm learning

## After the Test

### Scale the Winner:
1. Turn off losing variants
2. Duplicate winning ad set
3. Increase budget gradually (20% every 2-3 days)
4. Expand to lookalike audiences
5. Test new elements (copy, CTA, thumbnail)

## Questions to Answer:
- Which video had the best hook?
- What video hold rate (% watched) performed best?
- Did showing the interface vs. sound demo matter?
- What demographic engaged most?
- What placement performed best (Feed vs Stories vs Reels)?

## Quick Reference: Landing Page URL
Add to all ads: `https://[your-domain]/downloads?product=rubber-pre`

## Support Resources
- [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper)
- [Meta A/B Test Best Practices](https://www.facebook.com/business/help/1738164643098669)
- [Video Ad Specs](https://www.facebook.com/business/help/103816146375741)
