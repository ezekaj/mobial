# 📧 URGENT: API Support Request

**Send this to: support@mobimatter.com**

---

**Subject:** API All Endpoints Return 404 - Need Working Examples - Merchant: 0CC70512-AB2D-4175-9F28-63028C9DBB53

**Priority:** HIGH - Blocking Production Launch

---

## Account Details

```
Merchant ID: 0CC70512-AB2D-4175-9F28-63028C9DBB53
API Key: e66081acd05443f4bb1edc3573f159e9
Wallet Balance: $101.45 (visible in dashboard)
Test Products: ENABLED (toggled on/off)
IP Restriction: 0.0.0.0/0 (allows all)
```

---

## Problem

**ALL API endpoints return 404 "Resource not found"**

Despite:
- ✅ Credentials are correct (from dashboard)
- ✅ Wallet is funded ($101.45)
- ✅ Test products are enabled
- ✅ IP restriction allows all IPs
- ✅ Following documentation at docs.mobimatter.com

---

## Endpoints Tested (ALL Return 404)

### Wallet Balance
```bash
# All return 404
GET https://api.mobimatter.com/mobimatter/api/v2/wallet/balance
GET https://api.mobimatter.com/mobimatter/v2/wallet/balance
GET https://api.mobimatter.com/mobimatter/wallet/balance
GET https://api.mobimatter.com/api/v2/wallet/balance
GET https://api.mobimatter.com/v2/wallet/balance
```

### Products
```bash
# All return 404
GET https://api.mobimatter.com/mobimatter/api/v2/products
GET https://api.mobimatter.com/mobimatter/v2/products
GET https://api.mobimatter.com/mobimatter/api/v2/products/75b98dc7-c026-48c1-9fee-465681382d39
```

### Request Headers Used
```
merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53
api-key: e66081acd05443f4bb1edc3573f159e9
Content-Type: application/json
```

---

## What I Need From You

### 1. Working cURL Example

Please provide a **tested, working cURL command** for:
- Getting wallet balance
- Fetching product list
- Creating an order

### 2. Correct Base URL

Is the base URL correct?
```
https://api.mobimatter.com/mobimatter
```

### 3. Correct Endpoint Paths

Please confirm the exact paths for:
- Wallet balance endpoint
- Product list endpoint
- Order creation endpoint
- Order status endpoint

### 4. Account Status

- Is API access enabled for my merchant account?
- Are there any restrictions on my API key?
- Does the wallet need minimum balance for API access?

### 5. Alternative Access

- Do I need VPN access?
- Is there IP whitelisting required?
- Are there different API endpoints for different regions?

---

## Expected Response Format

What should a successful response look like?

**Example:**
```json
{
  "success": true,
  "data": {
    "balance": 101.45,
    "currency": "EUR"
  }
}
```

Or:
```json
{
  "balance": 101.45,
  "currency": "EUR"
}
```

---

## Testing Tools

I have created a test page at:
`http://localhost:3000/api-tester.html`

Happy to test any endpoints you provide in real-time.

---

## Timeline

**This is blocking our production launch.**

We need:
1. Working API endpoints within 24-48 hours
2. OR a scheduled call to debug together
3. OR access to a Postman collection with working examples

---

## Contact Preference

**Preferred response method:**
- [ ] Email with working cURL examples
- [ ] Scheduled call to debug together
- [ ] Access to your API testing tool/Postman collection
- [ ] Updated API documentation with correct paths

---

## Additional Context

- We are building a B2B reseller platform on top of MobiMatter
- We have $101.45 in wallet ready for testing
- We have customers waiting for launch
- We need this resolved urgently

---

**Please escalate this to your API/technical team if needed.**

Thank you for your urgent attention to this matter.

Best regards,
[Your Name]
Founder/CTO, MobiaL
[Your Email]
[Your Phone Number]

---

## Follow-up Actions

If no response within 24 hours:
1. Forward to MobiMatter account manager
2. Try alternative contact: partnerships@mobimatter.com
3. Check if there's a Slack/Discord community for API support
4. Look for API status page or known issues

---

**Send this email and let me know when you hear back!**
