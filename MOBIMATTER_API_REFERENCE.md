# 📚 MobiMatter API - Complete Reference

**Source:** https://docs.mobimatter.com  
**Last Updated:** March 7, 2026

---

## 🔑 Authentication

All API requests require these headers:

```
merchantId: <YOUR_MERCHANT_ID>
api-key: <YOUR_API_KEY>
Content-Type: application/json
```

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/products" \
  -H "merchantId: 0CC70512-AB2D-4175-9F28-63028C9DBB53" \
  -H "api-key: e66081acd05443f4bb1edc3573f159e9" \
  -H "Content-Type: application/json"
```

---

## 📦 Products API

### Get Products
**Endpoint:** `GET /api/v2/products`

**Query Parameters:**
- `provider` (optional) - Filter by provider ID
- `category` (optional) - Filter by category
- `country` (optional) - Filter by country code

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/products?provider=3&category=esim_replacement" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

**Response:**
```json
{
  "statusCode": 200,
  "result": [
    {
      "merchantId": "xxx",
      "uniqueId": "xxx",
      "productId": "xxx",
      "productFamilyName": "Product Name",
      "providerName": "Provider",
      "retailPrice": 29.99,
      "wholesalePrice": 24.00,
      "currencyCode": "USD",
      "countries": ["US"],
      "productDetails": [
        {"name": "PLAN_TITLE", "value": "USA 10GB"},
        {"name": "PLAN_DATA_LIMIT", "value": "10000"},
        {"name": "PLAN_VALIDITY", "value": "720"}
      ]
    }
  ]
}
```

---

## 🛒 Order APIs

### Place Order
**Endpoint:** `POST /api/v2/order`

**Request Body:**
```json
{
  "productId": "9f0d2dcb-31d7-46d0-846d-bb68aa710e7e",
  "productCategory": "esim_replacement",
  "addOnOrderIdentifier": "XYZ-2322234",
  "quantity": 1,
  "customerEmail": "customer@example.com",
  "customerPhone": "+1234567890"
}
```

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/order" \
  -H "merchantId: xxx" \
  -H "api-key: xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "xxx",
    "quantity": 1,
    "customerEmail": "customer@example.com"
  }'
```

**Response:**
```json
{
  "statusCode": 200,
  "result": {
    "orderId": "ORD-123456",
    "status": "pending",
    "total": 29.99,
    "currency": "USD"
  }
}
```

### Complete Order
**Endpoint:** `POST /api/v2/order/{orderId}/complete`

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/complete" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

**Response:**
```json
{
  "statusCode": 200,
  "result": {
    "orderId": "ORD-123456",
    "status": "completed",
    "lineItems": [
      {
        "qrCode": "data:image/png;base64,...",
        "activationCode": "LPA:1$smdp.example.com$ABC123",
        "iccid": "8944501234567890123",
        "smdpAddress": "smdp.example.com"
      }
    ]
  }
}
```

### Get Order Information
**Endpoint:** `GET /api/v2/order/{orderId}`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

**Response:**
```json
{
  "statusCode": 200,
  "result": {
    "orderId": "ORD-123456",
    "status": "completed",
    "createdAt": "2026-03-07T10:00:00Z",
    "completedAt": "2026-03-07T10:05:00Z"
  }
}
```

### Get Order by ICCID
**Endpoint:** `GET /api/v2/order/by-iccid/{iccid}`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/order/by-iccid/8944501234567890123" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

---

## 💳 Wallet APIs

### Get Wallet Balance
**Endpoint:** `GET /api/v2/merchant/wallet`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/merchant/wallet" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

**Response:**
```json
{
  "statusCode": 200,
  "result": {
    "balance": 101.45,
    "currency": "USD",
    "pendingAmount": 29.99,
    "availableBalance": 71.46
  }
}
```

---

## 📧 Notification APIs

### Notify User (Send Order Confirmation)
**Endpoint:** `POST /api/v2/order/{orderId}/notify`

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/notify" \
  -H "merchantId: xxx" \
  -H "api-key: xxx" \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com"}'
```

**Response:**
```json
{
  "statusCode": 200,
  "result": {
    "success": true,
    "messageId": "MSG-789"
  }
}
```

---

## 📊 Usage APIs

### Check Order Usage
**Endpoint:** `GET /api/v2/order/{orderId}/usage`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/usage" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

**Response:**
```json
{
  "statusCode": 200,
  "result": {
    "orderId": "ORD-123456",
    "iccid": "8944501234567890123",
    "dataUsed": 2.5,
    "dataTotal": 10,
    "validityDaysRemaining": 25,
    "status": "active"
  }
}
```

### Get Structured Usage
**Endpoint:** `GET /api/v2/provider/order/{orderId}/usage`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/provider/order/ORD-123456/usage" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

---

## 🔄 Replacement APIs

### Issue eSIM Replacement
**Endpoint:** `POST /api/v2/order/{orderId}/replacement`

**Request Body:**
```json
{
  "reason": "QR code not scanning",
  "productId": "9f0d2dcb-31d7-46d0-846d-bb68aa710e7e",
  "productCategory": "esim_replacement"
}
```

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/replacement" \
  -H "merchantId: xxx" \
  -H "api-key: xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "QR code not scanning",
    "productId": "xxx",
    "productCategory": "esim_replacement"
  }'
```

---

## 🚫 Cancel/Refund APIs

### Cancel Order
**Endpoint:** `POST /api/v2/order/{orderId}/cancel`

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/cancel" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

### Check If Order Is Refundable
**Endpoint:** `GET /api/v2/order/{orderId}/refundable`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/refundable" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

### Refund Order
**Endpoint:** `POST /api/v2/order/{orderId}/refund`

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/order/ORD-123456/refund" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

---

## 📱 Provider APIs

### Get Networks for Product
**Endpoint:** `GET /api/v2/product/{productId}/networks`

**Example:**
```bash
curl -X GET "https://api.mobimatter.com/mobimatter/api/v2/product/xxx/networks" \
  -H "merchantId: xxx" \
  -H "api-key: xxx"
```

### Send SMS to eSIM
**Endpoint:** `POST /api/v2/provider/order/{orderId}/sms`

**Request Body:**
```json
{
  "message": "Your activation code is: ABC123"
}
```

**Example:**
```bash
curl -X POST "https://api.mobimatter.com/mobimatter/api/v2/provider/order/ORD-123456/sms" \
  -H "merchantId: xxx" \
  -H "api-key: xxx" \
  -H "Content-Type: application/json" \
  -d '{"message": "Your activation code is: ABC123"}'
```

---

## 📋 Complete Order Flow

### Step 1: Get Products
```bash
GET /api/v2/products
```

### Step 2: Create Order (Pending)
```bash
POST /api/v2/order
Body: {"productId": "xxx", "quantity": 1, "customerEmail": "xxx"}
Result: {"orderId": "ORD-123", "status": "pending"}
```

### Step 3: Complete Order (Capture Payment)
```bash
POST /api/v2/order/ORD-123/complete
Result: {"orderId": "ORD-123", "status": "completed", "qrCode": "..."}
```

### Step 4: Notify Customer (Send Email)
```bash
POST /api/v2/order/ORD-123/notify
Body: {"email": "customer@example.com"}
Result: Email sent with QR code
```

### Step 5: Check Usage (Optional)
```bash
GET /api/v2/order/ORD-123/usage
Result: {"dataUsed": 2.5, "dataTotal": 10, "status": "active"}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid product ID"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid merchantId or api-key"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Order not found"
}
```

### 402 Payment Required
```json
{
  "statusCode": 402,
  "message": "Insufficient wallet balance"
}
```

---

## 🔗 Documentation Links

- **Main Docs:** https://docs.mobimatter.com
- **API Overview:** https://docs.mobimatter.com/docs/api-overview
- **Product List:** https://docs.mobimatter.com/docs/guides/getting-product-list
- **Place Order:** https://docs.mobimatter.com/docs/guides/placing-order
- **Check Usage:** https://docs.mobimatter.com/docs/guides/checking-usage
- **Replacement:** https://docs.mobimatter.com/docs/guides/issuing-replacement

---

## ✅ Confirmed Working Endpoints

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/v2/products` | ✅ Working | Returns 1,556 products |
| `POST /api/v2/order` | ⏳ Needs Testing | Order creation |
| `POST /api/v2/order/{id}/complete` | ⏳ Needs Testing | Order completion |
| `GET /api/v2/order/{id}` | ⏳ Needs Testing | Order info |
| `GET /api/v2/merchant/wallet` | ⏳ Needs Testing | Wallet balance |
| `POST /api/v2/order/{id}/notify` | ⏳ Needs Testing | Email notification |

---

**Last Updated:** March 7, 2026  
**Merchant ID:** 0CC70512-AB2D-4175-9F28-63028C9DBB53  
**Status:** Products API working, Order APIs pending testing
