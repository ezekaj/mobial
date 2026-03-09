# 📧 URGENT: API Access Request - Need Documentation & Enablement

**Send to:** support@mobimatter.com  
**CC:** partnerships@mobimatter.com (if available)

---

**Subject:** API Access Not Working - Need Documentation & Account Enablement - Merchant: 0CC70512-AB2D-4175-9F28-63028C9DBB53

**Priority:** CRITICAL - Blocking Business Launch

---

## Account Information

```
Merchant ID: 0CC70512-AB2D-4175-9F28-63028C9DBB53
API Key: e66081acd05443f4bb1edc3573f159e9
Wallet Balance: $101.45 USD
Test Products: Enabled
Partner Type: [Please confirm - Reseller/Affiliate/Business?]
```

---

## Problem Summary

**ALL API requests return 404 "Resource not found"**

Despite having:
- ✅ Valid Merchant ID and API Key from partner portal
- ✅ Funded wallet ($101.45)
- ✅ Test products enabled
- ✅ IP restriction set to 0.0.0.0/0 (allows all)

---

## What We've Tried

### Base URL Tested:
```
https://api.mobimatter.com/mobimatter
```

### Endpoints Tested (ALL return 404):
```bash
# Wallet
GET /api/v2/wallet/balance
GET /v2/wallet/balance
GET /wallet/balance

# Products
GET /api/v2/products
GET /api/v2/products/75b98dc7-c026-48c1-9fee-465681382d39

# All with headers:
merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53
api-key: e66081acd05443f4bb1edc3573f159e9
Content-Type: application/json
```

### Documentation Access:
- docs.mobimatter.com returns 404 for all API endpoint pages
- API documentation appears to be behind login
- Cannot access endpoint specifications

---

## What We Need From You

### 1. Confirm API Access Status

**Is API access enabled for our merchant account?**

- [ ] API access enabled
- [ ] API access pending approval
- [ ] API access requires additional verification
- [ ] API access not available for our partner type

### 2. Provide Working API Documentation

**Please provide ONE of the following:**

- [ ] Link to API documentation (if different from docs.mobimatter.com)
- [ ] PDF/Postman collection with endpoint specifications
- [ ] Access credentials for documentation portal
- [ ] Sample cURL commands that work with our account

### 3. Provide Working cURL Examples

**We need tested, working cURL commands for:**

```bash
# 1. Get wallet balance
curl -X GET "[CORRECT_URL]" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9"

# 2. List products
curl -X GET "[CORRECT_URL]" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9"

# 3. Create order
curl -X POST "[CORRECT_URL]" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9" \
  -d '{"productId":"...", "quantity":1, "customerEmail":"..."}'
```

### 4. Confirm Partner Type & Capabilities

**What partner type are we?**
- [ ] Reseller Partner (can buy and resell)
- [ ] Affiliate Partner (earn commissions)
- [ ] Business Partner (corporate rates)

**What capabilities do we have?**
- [ ] API access for product purchase
- [ ] API access for wallet management
- [ ] API access for order tracking
- [ ] White-label options
- [ ] Custom pricing

### 5. Timeline

**When will API access be working?**
- [ ] Already enabled (we have a configuration issue)
- [ ] Within 24 hours
- [ ] Within 1 week
- [ ] Requires additional approval process

---

## Business Impact

**This is blocking our entire business launch.**

We are building a B2B reseller platform and cannot:
- ❌ Test product purchasing
- ❌ Verify wallet deductions
- ❌ Build order fulfillment automation
- ❌ Launch to customers
- ❌ Generate revenue for MobiMatter

**Every day without API access delays our launch and MobiMatter's revenue share.**

---

## Preferred Resolution

**Fastest Path Forward:**

1. **Today:** Confirm if API access is enabled for our account
2. **Today:** Provide working cURL example we can test immediately
3. **This Week:** Full API documentation access
4. **Next Week:** Complete integration and launch

---

## Contact Information

**Primary Contact:**
- Name: [Your Name]
- Email: [Your Email]
- Phone: [Your Phone]
- Company: MobiaL

**Preferred Contact Method:** [Email/Phone/Slack/Teams]

**Available for Call:** [Your Availability]

---

## Escalation Request

**If no response within 24 hours, please escalate to:**
- API/Technical Team
- Partner Management Team
- Account Manager (if assigned)

---

## Alternative Contact

**If API support cannot resolve this, please connect us with:**
- Partner onboarding team
- Technical account manager
- Integration support specialist

---

**We are ready to launch and start selling. Please help us get API access working TODAY.**

Thank you for urgent attention to this matter.

Best regards,

[Your Name]  
Founder/CTO, MobiaL  
[Your Email]  
[Your Phone]  
[Your Timezone]

---

## Follow-up Schedule

- **24 hours:** Follow up if no response
- **48 hours:** Escalate to partnerships team
- **72 hours:** Request call with technical team
- **1 week:** Consider alternative providers if unresolved

---

**Send this email NOW and let me know when you hear back!**
