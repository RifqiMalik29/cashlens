# CashLens API Integration Guide

## Quick Reference for Mobile Developers

### Base URLs
```
Production: https://cashlens-backend-552315397645.us-central1.run.app
Development: http://localhost:8080
```

---

## Authentication Endpoints

### Login
```typescript
POST /api/v1/auth/login
Body: { email, password, language }
Response: { data: { access_token, refresh_token, user } }
```

### Register
```typescript
POST /api/v1/auth/register
Body: { email, password, name, language }
Response: { data: { user } }
```

### Refresh Token
```typescript
POST /api/v1/auth/refresh
Body: { refresh_token }
Response: { data: { access_token, refresh_token, token_type, expires_in } }
```

### Logout
```typescript
POST /api/v1/auth/logout
Body: { refresh_token }
Response: { message: "Logged out successfully" }
```

### Get Current User
```typescript
GET /api/v1/auth/me
Headers: Authorization: Bearer {access_token}
Response: { data: { id, email, name, preferences, ... } }
```

### Update Language
```typescript
PATCH /api/v1/auth/language
Body: { language: "id" | "en" }
Response: { message: "Language updated successfully" }
```

### Update Push Token
```typescript
PATCH /api/v1/auth/push-token
Body: { push_token: "ExponentPushToken[...]" }
Response: { message: "Push token updated successfully" }
```

### Telegram Status
```typescript
GET /api/v1/auth/telegram/status
Response: { data: { is_linked: boolean, chat_id?: number } }
```

### Unlink Telegram
```typescript
DELETE /api/v1/auth/telegram/status
Response: { message: "Telegram account unlinked successfully" }
```

---

## Subscription Endpoints

### Get Subscription Status
```typescript
GET /api/v1/subscription
Response: {
  data: {
    tier: "free" | "premium",
    expires_at: string | null,
    quota: {
      transactions_used: number,
      transactions_limit: number | null,
      scans_used: number,
      scans_limit: number | null
    }
  }
}
```

### Create Invoice
```typescript
POST /api/v1/payments/create-invoice
Body: { plan: "monthly" | "annual" | "founder_annual" }
Response: {
  data: {
    payment_url: string,
    invoice_id: string,
    expires_at: string,
    amount: number,
    plan: string
  }
}
```

### Verify Payment
```typescript
POST /api/v1/subscription/verify
Body: { invoice_id: string }
Response: { message: "payment verified and upgraded" }
```

---

## Budget Endpoints

### Get All Budgets
```typescript
GET /api/v1/budgets
Response: { data: Budget[] }
```

### Create Budget
```typescript
POST /api/v1/budgets
Body: {
  category_id: string,
  amount: number,
  period_type: "weekly" | "monthly" | "yearly",
  start_date: string,
  end_date: string
}
Response: { data: Budget }
```

### Update Budget
```typescript
PUT /api/v1/budgets/{id}
Body: {
  amount?: number,
  period_type?: string,
  start_date?: string,
  end_date?: string
}
Response: { data: Budget } // Full updated budget object
```

### Delete Budget
```typescript
DELETE /api/v1/budgets/{id}
Response: { message: "Budget deleted successfully" }
```

---

## Receipt Scanner

### Scan Receipt
```typescript
POST /api/v1/receipts/scan
Content-Type: multipart/form-data
Body:
  - image: File (required)
  - ocr_text: string (optional, fallback text from local OCR)

Response: {
  data: {
    amount: number,
    currency: string,
    date: string,
    merchant: string,
    category_id: string,
    confidence: number,
    items?: { name: string, price: number }[]
  }
}
```

**Usage Example:**
```typescript
// With image only
await receiptService.scanReceipt(imageUri);

// With OCR text fallback
await receiptService.scanReceipt({
  imageUri: imageUri,
  ocrText: extractedText
});
```

---

## Transaction Endpoints

### Get Transactions
```typescript
GET /api/v1/transactions?limit=20&offset=0
Response: { data: Transaction[] }
```

### Get by Date Range
```typescript
GET /api/v1/transactions/date-range?start=2026-04-01&end=2026-04-30
Response: { data: Transaction[] }
```

### Create Transaction
```typescript
POST /api/v1/transactions
Body: {
  category_id: string,
  amount: number,
  type: "expense" | "income",
  description: string,
  date: string (ISO 8601)
}
Response: { data: Transaction }
```

### Update Transaction
```typescript
PUT /api/v1/transactions/{id}
Body: {
  category_id?: string,
  amount?: number,
  description?: string,
  date?: string
}
Response: { message: "Transaction updated successfully" }
```

### Delete Transaction
```typescript
DELETE /api/v1/transactions/{id}
Response: { message: "Transaction deleted successfully" }
```

---

## Category Endpoints

### Get All Categories
```typescript
GET /api/v1/categories
Response: { data: Category[] }
```

### Create Category
```typescript
POST /api/v1/categories
Body: {
  name: string,
  type: "expense" | "income",
  icon: string
}
Response: { data: Category }
```

### Update Category
```typescript
PUT /api/v1/categories/{id}
Body: {
  name?: string,
  type?: string,
  icon?: string
}
Response: { message: "Category updated successfully" }
```

### Delete Category
```typescript
DELETE /api/v1/categories/{id}
Response: { message: "Category deleted successfully" }
```

---

## Error Handling

### Standard Error Response
```typescript
{
  error: string,
  details?: {
    [field]: string
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

### Rate Limits
- Free tier: 50 transactions/month, 5 scans/month
- Premium: Custom limits based on subscription

---

## Data Types

### User
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  language: "id" | "en";
  subscription_tier: "free" | "premium";
  subscription_expires_at?: string | null;
  is_founder: boolean;
  preferences?: {
    base_currency?: string;
    theme?: string;
  };
  created_at: string;
  updated_at: string;
}
```

### Budget
```typescript
interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period_type: "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  category_id: string;
  user_id: string;
  amount: number;
  type: "expense" | "income";
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  user_id: string;
  name: string;
  type: "expense" | "income";
  icon: string;
  created_at: string;
  updated_at: string;
}
```

---

## Best Practices

### 1. Always Handle the Data Wrapper
```typescript
// ✅ Correct
const response = await api.get<{ data: User[] }>("/api/v1/users");
const users = response.data;

// ❌ Wrong
const response = await api.get<User[]>("/api/v1/users");
// Our API client auto-unwraps, so this works too:
const users = await api.get<User[]>("/api/v1/users");
```

### 2. Use Refresh Token Flow
```typescript
// API client handles this automatically
// When 401 received, it tries to refresh before failing
const data = await api.get("/api/v1/protected-endpoint");
```

### 3. Send Language Header
```typescript
// API client automatically adds Accept-Language header
// Based on current i18n language
i18n.changeLanguage("en");
// Next API call will have: Accept-Language: en
```

### 4. Handle Network Errors Gracefully
```typescript
try {
  await authService.login(email, password);
} catch (error) {
  if (error.message.includes("network")) {
    // Show offline message
  } else if (error.message.includes("401")) {
    // Show authentication error
  }
}
```

### 5. Receipt Scanner with Fallback
```typescript
// Extract text locally first
const ocrText = await recognizeText(imageUri);

// Send both image and OCR text
await receiptService.scanReceipt({
  imageUri: imageUri,
  ocrText: ocrText // Backend uses this if vision fails
});
```

---

## Testing

### Health Check
```bash
curl https://cashlens-backend-552315397645.us-central1.run.app/health
```

### Test Login
```bash
curl -X POST https://cashlens-backend-552315397645.us-central1.run.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Support

- **API Documentation:** Import `apidog-openapi.yaml` into Postman/Apidog
- **Backend Issues:** Check backend logs in Google Cloud Console
- **Sentry Errors:** Monitor at sentry.io (filtered by user ID)
