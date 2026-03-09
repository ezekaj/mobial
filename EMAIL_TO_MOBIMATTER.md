# 📧 Email to MobiMatter Support - Wallet/Order API Access

**Send this email to get the correct endpoint paths**

---

**To:** support@mobimatter.com  
**Subject:** Wallet & Order API Endpoints Return 404 - Need Correct Paths

---

Hi MobiMatter Support Team,

I'm integrating with the MobiMatter API and have successfully implemented the Products API:

**✅ WORKING:**
```
GET https://api.mobimatter.com/mobimatter/api/v2/products
Result: Returns 1,556 products correctly
```

**❌ NOT WORKING - All Return 404:**

I've tried the following endpoints from your documentation, but they all return 404:

```bash
# Wallet Balance
GET https://api.mobimatter.com/mobimatter/api/v2/merchant/wallet
GET https://api.mobimatter.com/mobimatter/api/v2/wallet
GET https://api.mobimatter.com/mobimatter/wallet

# Order Creation
POST https://api.mobimatter.com/mobimatter/api/v2/order

# Order Completion
POST https://api.mobimatter.com/mobimatter/api/v2/order/{id}/complete
```

**All return:**
```json
{ "statusCode": 404, "message": "Resource not found" }
```

---

## My Account Details

```
Merchant ID: 0CC70512-AB2D-4175-9F28-63028C9DBB53
API Key: e66081acd05443f4bb1edc3573f159e9
Wallet Balance: ~$101.45 (visible in partner portal)
```

---

## Questions

1. **Are wallet and order APIs enabled for my merchant account?**

2. **Are the endpoint paths I'm using correct?** If not, what are the correct paths?

3. **Is there API documentation specific to my account?** The docs at docs.mobimatter.com show endpoints that return 404.

4. **Do I need additional approval or activation** to use the order APIs?

5. **Is there a sandbox/test mode** for testing orders without spending real wallet balance?

---

## What I Need

Please provide:

- [ ] **Correct endpoint URL for wallet balance**
- [ ] **Correct endpoint URL for order creation**
- [ ] **Correct endpoint URL for order completion**
- [ ] **Correct endpoint URL for order notification**
- [ ] **Confirmation that my API access is enabled**
- [ ] **Any additional headers or parameters required**

---

## Testing I've Done

**Products API (Working):**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/products" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9"

# Result: ✅ Returns 1,556 products
```

**Wallet API (Not Working):**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/merchant/wallet" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9"

# Result: ❌ 404 Resource not found
```

---

## Next Steps

Once you provide the correct endpoint paths, I will:

1. Test wallet balance endpoint
2. Test order creation with a test product
3. Test order completion
4. Test order notification
5. Complete the integration

---

## Urgency

This is blocking our platform launch. We have:
- ✅ Product catalog ready (1,556 products)
- ✅ Shopping cart functional
- ✅ Checkout UI ready
- ⏳ Order processing blocked (waiting for API paths)

**Please respond with the correct endpoint paths so we can proceed.**

---

Thank you for your assistance!

Best regards,

[Your Name]  
Founder/CTO, MobiaL  
[Your Email]  
[Your Phone Number]

---

## Follow-up Plan

- **24 hours:** Send follow-up if no response
- **48 hours:** Escalate to partnerships team
- **72 hours:** Request call with technical team
