# Mobile App Production Environment Update Summary

## Overview
This document summarizes all changes made to support the new production environment (Google Cloud Run) for the CashLens mobile app.

## Changes Completed ✅

### 1. Environment Configuration
- **Created** `.env` and `.env.local` with new production URL
- **Created** `app.config.js` for side-by-side dev/prod builds
- **Base URL**: `https://cashlens-backend-552315397645.us-central1.run.app`

### 2. API Client Updates
**File**: `src/services/api/apiClient.ts`
- Added `unwrapResponseData<T>()` helper to automatically unwrap `data` wrapper
- All API responses now automatically unwrap `{ "data": {...} }` → `{...}`
- Updated token refresh to handle new response structure

### 3. Authentication Service
**File**: `src/services/api/authService.ts`

**Updated Response Types**:
- **Login**: Now returns `{ access_token, refresh_token, user }` directly (unwrapped)
- **Register**: Returns `{ user }` (unwrapped from data wrapper)
- **getMe**: Returns `BackendUser` directly (no more `.data` access)
- **getTelegramStatus**: Returns `{ is_linked, chat_id? }` directly

**New Endpoints Added**:
```typescript
authService.updatePushToken(pushToken: string) // PATCH /api/v1/auth/push-token
authService.updateLanguage(language: string)   // PATCH /api/v1/auth/language (already existed)
```

### 4. Budget Service
**File**: `src/services/api/budgetService.ts`
- Simplified to use auto-unwrapped responses
- `updateBudget()` now safely returns `BudgetResponse` with full updated object
- No more manual `.data` extraction needed

### 5. Subscription Service
**File**: `src/services/api/subscriptionService.ts`
- Simplified to use auto-unwrapped responses
- `getSubscription()` returns `SubscriptionData` directly
- `createInvoice()` returns `CreateInvoiceResponse` directly

### 6. Receipt Scanner with OCR Fallback
**Files Modified**:
- `src/services/api/receiptService.ts`
- `src/services/gemini.ts`
- `src/services/receiptParser.ts`

**Changes**:
- Added `ScanReceiptOptions` interface with optional `ocrText` field
- `scanReceipt()` now accepts either `string` (backward compatible) or `ScanReceiptOptions`
- `parseReceiptImage()` accepts optional `ocrText` parameter
- STAGE 3 (Vision Fallback) now passes locally extracted OCR text to backend

**How It Works**:
1. App extracts text from receipt image using local OCR (ML Kit)
2. If local OCR succeeds with amount + merchant → returns immediately (offline mode)
3. If local OCR fails → sends image + OCR text to backend
4. Backend tries AI Vision first, falls back to OCR text if vision fails

### 7. Telegram Integration
**Already Implemented** (verified):
- `GET /api/v1/auth/telegram/status` - Check link status
- `DELETE /api/v1/auth/telegram/status` - Unlink Telegram
- Polling hook: `useTelegramRealtime.ts` (polls every 30s)

### 8. Subscription Features
**Already Implemented** (verified):
- `GET /api/v1/subscription` - Get tier, expiry, quota usage
- `POST /api/v1/payments/create-invoice` - Create Xendit payment
- `POST /api/v1/subscription/verify` - Verify payment completion

## Build Instructions

### Production Build
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Development Build (Side-by-Side)
```bash
# Set environment variable
APP_VARIANT=development eas build --platform android --profile development
APP_VARIANT=development eas build --platform ios --profile development
```

This will create a separate app:
- **Name**: CashLens (Dev)
- **Scheme**: `cashlens-dev`
- **Package**: `com.cashlens.app.dev`
- **Bundle ID**: `com.cashlens.app.dev`

## Testing Checklist

- [ ] **Login** - Verify token extraction from `access_token` and `refresh_token` fields
- [ ] **Register** - Verify user data is correctly extracted
- [ ] **Budget Update** - Test creating/updating budgets (verify no crash on `response.data.data.id`)
- [ ] **Receipt Scanner** - Test with clear image and blurry image (verify OCR fallback)
- [ ] **Telegram** - Check link status and unlink functionality
- [ ] **Subscription** - Verify quota display and payment flow
- [ ] **Language** - Test switching between `id` and `en`
- [ ] **Push Token** - Test token registration (when push notifications are implemented)

## Migration Notes

### Breaking Changes Handled
1. **Data Wrapper**: All responses now unwrapped automatically by API client
2. **Token Fields**: Login/register now use `access_token` and `refresh_token` (not `token`)
3. **Budget Update**: Returns full budget object (backend fix confirmed)

### Backward Compatibility
- `receiptService.scanReceipt()` still accepts string URI (backward compatible)
- API client unwrapper handles both wrapped and unwrapped responses gracefully

## Files Modified

| File | Changes |
|------|---------|
| `.env` | Created with production URL |
| `.env.local` | Created with URL config |
| `app.config.js` | Created for dev/prod variant support |
| `src/services/api/apiClient.ts` | Added data unwrapper helper |
| `src/services/api/authService.ts` | Updated responses, added push-token |
| `src/services/api/budgetService.ts` | Simplified response handling |
| `src/services/api/subscriptionService.ts` | Simplified response handling |
| `src/services/api/receiptService.ts` | Added OCR text support |
| `src/services/receiptParser.ts` | Pass OCR text to backend |
| `src/services/gemini.ts` | Accept and forward OCR text |

## Next Steps for Mobile Team

1. **Test the app** with the new production backend
2. **Implement push notifications** to use `updatePushToken()`:
   ```typescript
   import { registerForPushNotificationsAsync } from './notifications';
   
   const pushToken = await registerForPushNotificationsAsync();
   await authService.updatePushToken(pushToken);
   ```
3. **Add Google ML Kit** for local OCR extraction (if not already integrated)
4. **Update app icons/branding** if needed for dev/prod distinction
