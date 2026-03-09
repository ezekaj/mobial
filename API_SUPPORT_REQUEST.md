# 📧 MobiMatter API Support Request Template

## Copy and send this to support@mobimatter.com

---

**Subject:** API Endpoints Return 404 - Need Correct Paths - Merchant: 0CC70512-AB2D-4175-9F28-63028C9DBB53

**Body:**

Hi MobiMatter Support Team,

I'm trying to integrate with your B2B API but all my requests return 404 errors. I need help verifying the correct endpoint paths.

**My Account Details:**
- Merchant ID: `0CC70512-AB2D-4175-9F28-63028C9DBB53`
- API Key: `e66081acd05443f4bb1edc3573f159e9`
- Wallet Balance: ~100 EUR (needs verification)

**What I've Tried:**

Base URL: `https://api.mobimatter.com/mobimatter`

Tested endpoints (all return 404):
```
GET /api/v2/wallet/balance
GET /api/v1/wallet/balance
GET /wallet/balance
GET /api/v2/products
```

**Request Headers:**
```
merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53
api-key: e66081acd05443f4bb1edc3573f159e9
Content-Type: application/json
```

**Questions:**

1. Is API access enabled for my merchant account?
2. What are the CORRECT endpoint paths for:
   - Getting wallet balance
   - Fetching products list
   - Creating an order
   - Getting order status
3. Does my wallet need to be funded before API access works?
4. Are there any IP whitelisting requirements?
5. Can you provide a working cURL example for wallet balance?

**Documentation Reference:**
I'm following https://docs.mobimatter.com but the endpoints documented there return 404.

**Expected Response:**
A working cURL example or Postman collection that I can test.

Thank you for your assistance!

Best regards,
[Your Name]
MobiaL Team

---

## Alternative: Test via Partner Portal

While waiting for support response, you can:

1. **Login to Partner Portal**: https://partner.mobimatter.com
2. **Check Wallet Balance**: Should show ~100 EUR
3. **Check API Section**: Verify API access is enabled
4. **Look for API Documentation**: They might have endpoint examples in the portal

---

## Quick Test Commands

Once you get the correct endpoints from support, test with:

```bash
# Wallet Balance
curl -X GET "https://api.mobimatter.com/mobimatter/[CORRECT_PATH]" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9"

# Products List  
curl -X GET "https://api.mobimatter.com/mobimatter/[CORRECT_PATH]/products" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9"
```

---

**Send this email and forward their response to me so I can update the code with correct endpoints!**
