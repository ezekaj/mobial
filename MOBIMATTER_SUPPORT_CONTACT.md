# 📧 MobiMatter Support Contact - API Endpoint Paths Needed

## Contact Information

**Primary Support:** support@mobimatter.com  
**Partnerships:** partnerships@mobimatter.com (if available)  
**Technical:** Check partner portal for technical support contact

---

## Email Template - Copy & Send

```
Subject: API Endpoint Paths Needed for Wallet & Orders - Merchant: 0CC70512-AB2D-4175-9F28-63028C9DBB53

Dear MobiMatter Support Team,

I am integrating with the MobiMatter B2B API and need assistance with endpoint paths.

CURRENT STATUS:
✅ WORKING: GET /api/v2/products
   - Successfully fetches product catalog
   - Returns products in "result" array
   - Merchant account has products assigned

❌ NOT WORKING (All return 404):
   - GET /api/v2/wallet/balance
   - POST /api/v2/orders
   - POST /api/v2/orders/{orderId}/complete
   - POST /api/v2/orders/{orderId}/notify
   - GET /api/v2/orders/{orderId}/usage

MERCHANT CREDENTIALS:
   Merchant ID: 0CC70512-AB2D-4175-9F28-63028C9DBB53
   API Key: e66081acd05443f4bb1edc3573f159e9
   Wallet Balance: ~$101.45 USD (from partner portal)

QUESTIONS:

1. Are wallet and order APIs on a different base URL?
   - Products: https://api.mobimatter.com/mobimatter/api/v2/products ✅
   - Orders: ??? ❌

2. Do these endpoints require additional enablement?
   - Is my partner account type sufficient?
   - Are there approval requirements?

3. What are the CORRECT endpoint paths for:
   - Getting wallet balance
   - Creating an order (pending state)
   - Completing an order (capture payment)
   - Notifying customer (send email)
   - Checking order usage

4. Is there API documentation available?
   - docs.mobimatter.com returns 404 for API pages
   - Is documentation behind partner portal login?

REQUESTED ACTION:

Please provide:
□ Correct endpoint URLs for wallet and order APIs
□ Link to API documentation
□ Confirmation that my account has API access enabled
□ Any additional requirements for API access

TESTING:

I am ready to test immediately once I have the correct paths.
I have test products assigned and wallet funded.

TIMELINE:

This is blocking our platform launch. Urgent response appreciated.

Thank you for your assistance!

Best regards,
[Your Name]
Founder/CTO, MobiaL
[Your Email]
[Your Phone]
```

---

## Alternative Contact Methods

### Partner Portal
1. Login: https://partner.mobimatter.com
2. Look for:
   - "Support" or "Help" section
   - "API Documentation" link
   - "Contact Us" or "Submit Ticket"
   - Account manager contact info

### Live Chat
- Check if partner portal has live chat
- Usually fastest response time

### Phone Support
- Check partner portal for phone number
- Best for urgent issues

---

## Follow-up Schedule

### If No Response in 24 Hours
**Send follow-up:**
```
Subject: RE: API Endpoint Paths Needed - FOLLOW UP

Hi,

Following up on my previous email regarding API endpoint paths.

This is blocking our platform launch. Can you please:
1. Confirm receipt of this request
2. Provide timeline for response
3. Escalate to technical team if needed

Merchant: 0CC70512-AB2D-4175-9F28-63028C9DBB53

Thank you!
```

### If No Response in 48 Hours
**Escalate:**
- CC partnerships@mobimatter.com
- Request call with technical team
- Ask for account manager assignment

### If No Response in 72 Hours
**Consider:**
- Alternative contact: LinkedIn message to MobiMatter team
- Check if there's a Slack/Discord community
- Look for alternative eSIM providers as backup

---

## What to Expect

### Ideal Response
```
Hi,

Thank you for contacting MobiMatter support.

The correct endpoint paths are:
- Wallet Balance: GET /api/v2/merchant/wallet/balance
- Create Order: POST /api/v2/merchant/orders
- Complete Order: POST /api/v2/merchant/orders/{id}/complete
- Notify User: POST /api/v2/merchant/orders/{id}/notify

Please note that order APIs require your wallet to have sufficient balance.

Documentation is available at: https://partner.mobimatter.com/api-docs
(Login required)

Let us know if you need any assistance!

Best regards,
MobiMatter Support Team
```

### Possible Responses

**Response Type 1: "API Access Not Enabled"**
- Ask: "What do I need to do to enable API access?"
- Timeline: Usually 1-3 business days

**Response Type 2: "Different Endpoint Paths"**
- Test immediately with provided paths
- Report back if they work

**Response Type 3: "Documentation Link"**
- Login and download documentation
- Review all endpoint paths
- Test systematically

**Response Type 4: "Schedule a Call"**
- Accept the call
- Prepare questions in advance
- Request written summary after call

---

## Testing Checklist (Once You Get Paths)

### Before Testing
- [ ] Wallet has sufficient balance ($10+)
- [ ] Test products are assigned
- [ ] API credentials are copied correctly

### Test Sequence
1. **Wallet Balance** - Verify balance shows correctly
2. **Get Products** - Already working ✅
3. **Create Order** - Use test product ($0.01)
4. **Complete Order** - Verify eSIM details returned
5. **Notify User** - Check email delivery
6. **Check Usage** - Verify usage data (if available)

### Success Criteria
- [ ] All endpoints return 200 (not 404)
- [ ] Wallet balance deducts correctly
- [ ] Order creates in pending state
- [ ] Order completes successfully
- [ ] Email is sent to customer
- [ ] eSIM QR code is valid

---

## Backup Plan

### If Support is Unresponsive (1+ week)

**Option 1: Manual Order Processing**
- Customer orders on your site
- You manually create order in MobiMatter partner portal
- You manually send eSIM to customer
- Not scalable but works temporarily

**Option 2: Affiliate Model**
- Redirect to MobiMatter with affiliate link
- Earn 30% commission
- No API integration needed
- Lower margins but immediate launch

**Option 3: Alternative Provider**
- Research other eSIM API providers
- Airalo, GigsGigs, etc.
- Compare API documentation quality
- Migrate if needed

---

## Current Implementation Status

### ✅ Ready to Launch (Waiting for API Paths)
- Product catalog ✅
- Shopping cart ✅
- Checkout UI ✅
- Admin dashboard ✅

### ⏳ Blocked (Need API Paths)
- Payment processing ⏳
- Order creation ⏳
- Order fulfillment ⏳
- Email notifications ⏳

### 📊 Progress
- **Frontend:** 90% complete
- **Backend:** 60% complete (blocked on API)
- **Overall:** 75% ready to launch

---

## Quick Reference

### Working Endpoints
```
GET https://api.mobimatter.com/mobimatter/api/v2/products
Headers: merchantId, api-key
Response: { "statusCode": 200, "result": [...] }
```

### Need Paths For
```
GET ??? (wallet balance)
POST ??? (create order)
POST ??? (complete order)
POST ??? (notify user)
GET ??? (order usage)
```

### Merchant Credentials
```
Merchant ID: 0CC70512-AB2D-4175-9F28-63028C9DBB53
API Key: e66081acd05443f4bb1edc3573f159e9
Base URL: https://api.mobimatter.com/mobimatter
```

---

**Send this email NOW and start follow-up tracking!**

Time is critical - every day without API access delays launch.
