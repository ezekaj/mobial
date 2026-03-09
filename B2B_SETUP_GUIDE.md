# 🚀 MobiaL B2B Platform - Setup Guide

## Welcome to Your B2B eSIM Marketplace!

Your platform is now being configured as a **B2B MobiMatter Reseller** with your own affiliate program.

---

## ✅ What's Been Completed

### 1. MobiMatter B2B API Integration
- ✅ API credentials configured
- ✅ B2B client library created (`src/lib/mobimatter.ts`)
- ✅ Test endpoint created (`/api/b2b/test`)
- ✅ Wallet balance endpoint (`/api/b2b/wallet`)

### 2. Stripe Payment Integration
- ✅ Stripe library installed
- ✅ Payment processing library created (`src/lib/stripe.ts`)
- ✅ Environment variables configured

### 3. Environment Configuration
- ✅ `.env.local` updated with all required variables
- ✅ `.env.example` updated as template

---

## 📋 What You Need to Do NOW

### Step 1: Test MobiMatter API Connection

**Open your browser and go to:**
```
http://localhost:3000/api/b2b/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API connection successful",
  "wallet": {
    "balance": 0.00,
    "currency": "USD"
  },
  "sampleProducts": [...]
}
```

**If you see an error:**
- Check your Merchant ID and API Key in `.env.local`
- Verify your MobiMatter wallet is funded
- Contact MobiMatter support if credentials are invalid

---

### Step 2: Fund Your MobiMatter Wallet

**IMPORTANT:** You need to add funds to your MobiMatter wallet to sell eSIMs.

1. **Login to**: https://partner.mobimatter.com
2. **Go to**: Wallet section
3. **Add funds**: $500-1000 recommended to start
4. **Payment methods**: Bank transfer, credit card

**Why fund first?**
- Every eSIM you sell is purchased from your wallet
- MobiMatter deducts wholesale price automatically
- You keep the retail margin

---

### Step 3: Set Up Stripe

**You need Stripe to accept customer payments.**

1. **Sign up at**: https://stripe.com
2. **Get your API keys** from: https://dashboard.stripe.com/apikeys
3. **Update `.env.local`**:

```bash
# Replace with YOUR actual Stripe keys
STRIPE_SECRET_KEY="sk_test_51ABC..."
STRIPE_PUBLISHABLE_KEY="pk_test_51ABC..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # Set up later
```

4. **Test mode vs Live mode:**
   - Start with `sk_test_...` keys (test mode)
   - Switch to `sk_live_...` keys when ready for real payments

---

### Step 4: Set Your Pricing Strategy

**Edit `.env.local`:**

```bash
# Price markup (0.50 = 50% markup on wholesale)
AFFILIATE_PRICE_MARKUP="0.50"

# Commission for YOUR affiliates (10% of retail price)
AFFILIATE_COMMISSION_RATE="0.10"
```

**Example Pricing:**
```
Product: Japan 10GB eSIM
MobiMatter Wholesale: $10.00 (from your wallet)
Your Markup: 50%
Retail Price: $15.00 (customer pays)
Your Gross Profit: $5.00

Affiliate Commission: 10% of $15.00 = $1.50
Your Net Profit: $3.50
```

---

## 🧪 Test Your Setup

### Test 1: API Connection
```bash
curl http://localhost:3000/api/b2b/test
```

### Test 2: Wallet Balance
```bash
curl http://localhost:3000/api/b2b/wallet
```

### Test 3: Product Sync
```bash
curl http://localhost:3000/api/products
```

---

## 💰 Revenue Model

### Transaction Flow

```
1. Customer buys eSIM from you → Pays $15.00 via Stripe
2. Stripe deposits to your bank → You receive $15.00 (minus Stripe fees)
3. You auto-buy from MobiMatter → $10.00 deducted from wallet
4. Customer receives eSIM → Delivered by MobiMatter
5. Affiliate gets commission → $1.50 (if referred)
6. Your profit → $3.50 (minus payment processing fees)
```

### Monthly Projection

```
100 sales/month × $3.50 profit = $350/month
500 sales/month × $3.50 profit = $1,750/month
1000 sales/month × $3.50 profit = $3,500/month
```

---

## 📊 Next Development Steps

### Phase 1: Complete This Week
- [x] B2B API integration
- [x] Stripe integration
- [ ] Fund MobiMatter wallet
- [ ] Configure Stripe keys
- [ ] Test complete purchase flow

### Phase 2: Next Week
- [ ] Affiliate system database
- [ ] Affiliate signup page
- [ ] Affiliate dashboard
- [ ] Commission tracking

### Phase 3: Week 3
- [ ] Order fulfillment automation
- [ ] Admin dashboard
- [ ] Customer order management
- [ ] Email notifications

---

## 🔧 Configuration Options

### Option 1: Low Margin, High Volume
```bash
AFFILIATE_PRICE_MARKUP="0.20"  # 20% markup
AFFILIATE_COMMISSION_RATE="0.15"  # 15% to affiliates
```
**Strategy:** Competitive prices, affiliates love you

### Option 2: High Margin, Premium
```bash
AFFILIATE_PRICE_MARKUP="1.00"  # 100% markup
AFFILIATE_COMMISSION_RATE="0.10"  # 10% to affiliates
```
**Strategy:** Premium positioning, higher profits

### Option 3: Balanced (Recommended)
```bash
AFFILIATE_PRICE_MARKUP="0.50"  # 50% markup
AFFILIATE_COMMISSION_RATE="0.10"  # 10% to affiliates
```
**Strategy:** Fair prices, good margins, affiliate incentives

---

## 🆘 Troubleshooting

### Issue: API test returns "credentials not configured"

**Solution:**
```bash
# Check .env.local
cat .env.local | grep MOBIMATTER

# Restart server
bun run dev
```

### Issue: Wallet balance is 0

**Solution:**
- Login to https://partner.mobimatter.com
- Fund your wallet via bank transfer or card
- Wait for funds to clear (1-3 business days)

### Issue: Stripe not configured

**Solution:**
```bash
# Check .env.local
cat .env.local | grep STRIPE

# Ensure keys start with sk_test_ or sk_live_
# Restart server
bun run dev
```

---

## 📞 Support Resources

### MobiMatter B2B
- API Docs: https://docs.mobimatter.com
- Partner Portal: https://partner.mobimatter.com
- Support: support@mobimatter.com

### Stripe
- Dashboard: https://dashboard.stripe.com
- API Docs: https://stripe.com/docs/api
- Support: https://support.stripe.com

### Your Platform
- Logs: Check `server.log`
- Debug: Add `console.log()` statements
- Test: Use browser DevTools Network tab

---

## 🎯 Success Checklist

### Before Launch:
- [ ] MobiMatter wallet funded ($500+)
- [ ] Stripe account verified
- [ ] Test purchase completed successfully
- [ ] Affiliate program configured
- [ ] Pricing strategy set
- [ ] Terms of service written
- [ ] Refund policy defined

### First Month Goals:
- [ ] 10+ sales
- [ ] 5+ affiliates signed up
- [ ] Positive customer reviews
- [ ] Profitable after all costs

---

**Ready to launch? Complete the steps above and start selling! 🚀**

Last Updated: March 7, 2026
Version: 1.0
