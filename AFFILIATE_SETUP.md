# 🚀 MobiaL Affiliate Platform - Setup Guide

## Welcome to Your Affiliate Marketplace!

Your platform is now configured as a **MobiMatter Affiliate Marketplace**. Customers browse products on your site, but purchases happen on MobiMatter with your 30% commission tracked automatically.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Get Your MobiMatter Affiliate Code

1. Go to [MobiMatter Affiliate Program](https://mobimatter.com/affiliate)
2. Sign up for an affiliate account
3. Get your unique affiliate code (e.g., `YOURCODE123`)

### Step 2: Configure Your Environment

Edit `.env.local`:

```bash
# Replace YOUR_AFFILIATE_CODE_HERE with your actual code
MOBIMATTER_AFFILIATE_CODE="YOURCODE123"
NEXT_PUBLIC_AFFILIATE_CODE="YOURCODE123"

# Optional: Adjust commission rate if different from 30%
AFFILIATE_COMMISSION_RATE="0.30"

# Optional: Add markup to prices (0.00 = MobiMatter prices, 0.10 = 10% markup)
AFFILIATE_PRICE_MARKUP="0.00"
```

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
bun run dev
```

### Step 4: Test Affiliate Links

1. Go to http://localhost:3000/products
2. Click "Buy on MobiMatter" on any product
3. You should be redirected to MobiMatter with `?ref=YOURCODE123` in the URL

---

## 📊 How It Works

### Customer Journey

```
1. Customer browses your site (localhost:3000)
2. Clicks "Buy on MobiMatter"
3. Redirected to MobiMatter with your affiliate code
4. Completes purchase on MobiMatter
5. MobiMatter delivers eSIM to customer
6. You earn 30% commission
```

### Revenue Flow

```
Product Price: $29.99
↓
Customer Pays: $29.99 (to MobiMatter)
↓
Your Commission: $9.00 (30% from MobiMatter)
↓
MobiMatter Keeps: $20.99
```

### With Price Markup (Optional)

```
MobiMatter Price: $29.99
Your Markup: 10% ($3.00)
↓
Customer Pays: $32.99 (to MobiMatter)
↓
Your Commission: $9.00 (30% of $29.99)
Your Markup: $3.00
↓
Total You Earn: $12.00
```

---

## 🎯 Configuration Options

### Option 1: Match MobiMatter Prices (Recommended for Start)

```env
AFFILIATE_PRICE_MARKUP="0.00"
```

**Pros:**
- Competitive pricing
- Higher conversion rate
- Simpler to explain to customers

**Cons:**
- Only earn 30% commission

### Option 2: Add Price Markup

```env
AFFILIATE_PRICE_MARKUP="0.10"  # 10% markup
```

**Pros:**
- Higher earnings per sale
- Can run "discounts" from marked-up price

**Cons:**
- Higher prices may reduce conversions
- Need to explain why prices differ from MobiMatter

### Option 3: Discount Strategy

```env
AFFILIATE_PRICE_MARKUP="-0.05"  # 5% discount
```

**Pros:**
- Lower prices drive more sales
- Still earn 30% commission from MobiMatter

**Cons:**
- Need to verify MobiMatter allows this
- May confuse customers

---

## 📈 Tracking Your Earnings

### Manual Tracking (Phase 1)

1. **Monthly Commission Report**
   - Log into MobiMatter affiliate dashboard
   - Download monthly commission report
   - Enter into your admin dashboard

2. **Click Tracking**
   - Your site tracks all clicks to MobiMatter
   - View in your analytics dashboard
   - Compare clicks vs. commissions

### Automated Tracking (Phase 2 - Coming Soon)

- MobiMatter API integration
- Real-time commission sync
- Automatic earnings dashboard

---

## 🔧 Customization

### Update Product Card Button Text

Edit `src/components/common/product-card.tsx`:

```tsx
<a href={mobimatterUrl} target="_blank" rel="noopener noreferrer">
  <ExternalLink className="h-4 w-4 mr-2" />
  Buy on MobiMatter  {/* Change this text */}
</a>
```

### Add Custom Tracking Parameters

Edit `src/lib/mobimatter-affiliate.ts`:

```typescript
export function generateAffiliateLink(productId?: string, options?: {
  campaign?: string;  // Add campaign tracking
  source?: string;    // Add source tracking
}): string {
  // ... existing code
}
```

### Customize Redirect Page

Edit `src/app/checkout/redirected/page.tsx`:

- Change messaging
- Add your logo
- Add support contact info

---

## 📝 Next Steps

### This Week

1. ✅ Get affiliate code from MobiMatter
2. ✅ Update `.env.local` with your code
3. ✅ Test affiliate links work
4. ✅ Make a test purchase through your link
5. ✅ Verify commission appears in MobiMatter dashboard

### Next Week

1. Add commission tracking dashboard
2. Set up automated product sync
3. Add click analytics
4. Create blog posts with affiliate links

### Month 2

1. Optimize pricing strategy
2. Add email marketing
3. Create social media campaigns
4. Analyze conversion rates

---

## 🆘 Troubleshooting

### Issue: Affiliate code not appearing in URLs

**Solution:**
```bash
# Check .env.local
echo $NEXT_PUBLIC_AFFILIATE_CODE

# Restart server
bun run dev
```

### Issue: Redirect not working

**Solution:**
1. Check browser console for errors
2. Verify `mobimatterUrl` is correct format
3. Check popup blocker settings

### Issue: Commissions not tracking

**Solution:**
1. Verify affiliate code is correct
2. Check that `?ref=YOURCODE` is in URL
3. Contact MobiMatter affiliate support
4. Ensure cookies aren't blocked

---

## 💰 Maximizing Earnings

### Strategy 1: Content Marketing

Write blog posts like:
- "Best eSIMs for Japan 2026"
- "How to Save on Roaming Charges"
- "eSIM vs Physical SIM: Which is Better?"

Each post includes affiliate links → Earn commissions

### Strategy 2: Price Comparison

Show MobiMatter prices vs. competitors:
- "MobiMatter: $29.99"
- "Competitor: $39.99"
- "You Save: $10.00"

Highlight savings → More conversions

### Strategy 3: Bundle Recommendations

Create "travel packages":
- "Europe Trip: 5 Country eSIM Bundle"
- Link to multiple products
- Earn commission on each

---

## 📞 Support

### MobiMatter Affiliate Support
- Email: affiliate@mobimatter.com
- Dashboard: https://mobimatter.com/affiliate/dashboard

### Your Platform Support
- Check logs: `server.log`
- Debug mode: Add `console.log()` statements
- Test mode: Use browser DevTools Network tab

---

## 🎉 Success Metrics

### Week 1 Goals
- [ ] Affiliate code configured
- [ ] Test purchase completed
- [ ] Commission tracked

### Month 1 Goals
- [ ] 100+ clicks to MobiMatter
- [ ] 10+ conversions
- [ ] $100+ commissions earned

### Month 3 Goals
- [ ] 1000+ clicks to MobiMatter
- [ ] 100+ conversions
- [ ] $1000+ commissions earned

---

**Ready to start earning? Update your `.env.local` and launch! 🚀**

Last Updated: March 7, 2026
Version: 1.0
