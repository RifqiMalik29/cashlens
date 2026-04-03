# Store Deployment Guide

This guide covers the complete process of deploying CashLens to Google Play Store and Apple App Store.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Google Play Store Deployment](#google-play-store-deployment)
3. [Apple App Store Deployment](#apple-app-store-deployment)
4. [Post-Deployment](#post-deployment)
5. [Maintenance & Updates](#maintenance--updates)

---

## Pre-Deployment Checklist

### 1. Legal & Policy Documents

#### Privacy Policy

**Required by both stores.** Must cover:

- What data you collect (transactions, categories, preferences)
- How data is stored (local SQLite, Supabase cloud sync)
- Third-party services (Supabase, ML Kit)
- User rights (data export, deletion)

**Action:**

- Create privacy policy using tools like [TermsFeed](https://www.termsfeed.com/privacy-policy-generator/) or [GetTerms](https://getterms.io/)
- Host it publicly (GitHub Pages, your website, or Supabase static hosting)
- Add link to app settings screen

#### Terms of Service

**Recommended but not always required.**

**Action:**

- Create ToS covering acceptable use, disclaimers, liability
- Host publicly alongside privacy policy

### 2. App Store Assets

#### App Icon

- **Android:** 512x512px PNG (adaptive icon with foreground + background layers)
- **iOS:** 1024x1024px PNG (no transparency, no rounded corners)

**Action:**

```bash
# Use tools like:
# - https://easyappicon.com/
# - https://appicon.co/
# - Figma/Sketch export at required sizes
```

#### Screenshots

- **Android:** Min 2, max 8 screenshots (16:9 or 9:16 ratio recommended)
- **iOS:** Required for 6.5" display (1284x2778px) and 5.5" display (1242x2208px)

**Recommended screenshots:**

1. Dashboard with summary cards
2. Transaction list view
3. Scanner/OCR in action
4. Analytics/spending chart
5. Budget tracking
6. Settings/customization

**Action:**

- Use Android Studio Device Frame Generator or [Previewed](https://previewed.app/)
- Take screenshots on actual devices
- Add captions highlighting key features

#### Feature Graphic (Android only)

- **Size:** 1024x500px
- Displayed at top of Play Store listing

### 3. Store Listing Content

#### Short Description (Android)

Max 80 characters.

**Example:**

```
Track expenses instantly with receipt scanning & multi-currency support
```

#### Full Description

Max 4000 characters (Android), 4000 characters (iOS).

**Template:**

```markdown
📸 Scan receipts & QRIS screenshots instantly
💰 Multi-currency support for digital nomads
📊 Smart analytics & budget tracking
🔒 Privacy-first with on-device OCR

CashLens makes personal finance management effortless. Simply scan your receipts or payment screenshots, and let our on-device OCR extract transaction details automatically.

KEY FEATURES:
✓ Receipt & Screenshot Scanning (ML Kit OCR)
✓ Multi-Currency Support
✓ Cloud Sync with Supabase
✓ Spending Analytics & Charts
✓ Budget Tracking & Alerts
✓ Category Management
✓ Export to CSV/PDF

PRIVACY FOCUSED:
All OCR processing happens on your device. Your financial data is yours.

FREE FEATURES:
• Manual transaction entry
• Basic analytics
• Local storage

PREMIUM FEATURES:
• Unlimited scanning
• Cloud backup & sync
• Advanced analytics
• Custom themes & icons
• Budget alerts

Perfect for:
• QRIS & mobile banking users in Indonesia
• Small business owners tracking expenses
• Digital nomads managing multiple currencies
```

#### Keywords/Tags

**Android:** Up to 5 tags
**iOS:** 100 character keyword field

**Suggestions:**

- expense tracker
- budget app
- receipt scanner
- personal finance
- money manager

### 4. Code Preparation

#### Remove Debug Code

```bash
# Search for console.logs
grep -r "console.log" src/

# Remove all debug logs or wrap in __DEV__ check
if (__DEV__) {
  console.log('...');
}
```

#### Environment Variables

**Action:**

- Ensure `.env` is in `.gitignore`
- Use EAS Secrets for sensitive keys

```bash
eas secret:create --name SUPABASE_URL --value "your-url"
eas secret:create --name SUPABASE_ANON_KEY --value "your-key"
```

#### App Versioning

Update `app.json` or `app.config.ts`:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

**Version rules:**

- `version`: User-facing (1.0.0, 1.0.1, 1.1.0)
- `versionCode` (Android): Integer, must increment with each release
- `buildNumber` (iOS): String, must increment

#### Crash Reporting

**Recommended:** Sentry

```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative -p ios android
```

Add to `App.tsx`:

```typescript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "your-sentry-dsn",
  enableInExpoDevelopment: false,
  debug: __DEV__
});
```

#### Performance Testing

**Action:**

- Test on low-end Android device (3GB RAM)
- Test OCR with 10+ receipt images
- Test offline mode
- Test cloud sync with poor network
- Check app size (target <50MB for initial download)

---

## Google Play Store Deployment

### 1. Create Google Play Developer Account

**Cost:** $25 (one-time fee)

**Steps:**

1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with Google account
3. Pay registration fee
4. Complete account details (developer name, contact email)

**Processing time:** Usually instant, but can take 48 hours for verification.

### 2. Build Release APK/AAB

#### Option A: Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android --profile production
```

**What this does:**

- Creates optimized production build
- Handles code signing automatically
- Generates AAB (Android App Bundle) file

#### Option B: Local Build

```bash
# Generate Android assets
npx expo prebuild --platform android

# Navigate to android directory
cd android

# Build release AAB
./gradlew bundleRelease

# AAB will be at: android/app/build/outputs/bundle/release/app-release.aab
```

### 3. Create Keystore (for signing)

If building locally, you need a keystore:

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore cashlens-release.keystore \
  -alias cashlens-key \
  -keyalg RSA -keysize 2048 -validity 10000
```

**CRITICAL:** Backup this keystore file. If you lose it, you can never update your app.

Store keystore details:

```
Keystore path: /path/to/cashlens-release.keystore
Keystore password: [your-password]
Key alias: cashlens-key
Key password: [your-key-password]
```

### 4. Create App in Play Console

1. **Go to Play Console** → "All apps" → "Create app"
2. **Fill in details:**
   - App name: CashLens
   - Default language: Indonesian (or English)
   - App type: App
   - Free/Paid: Free
3. **Complete declarations:**
   - Privacy policy URL
   - App access (all features available without login/payment)
   - Ads (No ads)
   - Content rating (Everyone)
   - Target audience (Age 18+)
   - Data safety (what data you collect)

### 5. Upload Build

1. **Go to** → "Production" → "Create new release"
2. **Upload AAB** file
3. **Fill release details:**
   - Release name: 1.0.0
   - Release notes (in English + Indonesian):

   ```
   Initial release of CashLens!

   Features:
   • Receipt & screenshot scanning with OCR
   • Multi-currency transaction tracking
   • Spending analytics & charts
   • Budget management
   • Cloud sync
   ```

### 6. Complete Store Listing

**Main store listing:**

- App name: CashLens
- Short description (80 chars)
- Full description (4000 chars)
- App icon (512x512px)
- Feature graphic (1024x500px)
- Screenshots (at least 2)
- App category: Finance
- Contact email
- Privacy policy URL

**Pricing & distribution:**

- Countries: Indonesia, United States, etc.
- Pricing: Free
- Content rating: Complete questionnaire

### 7. Submit for Review

1. Click "Send for review"
2. Review can take **1-7 days**
3. You'll get email when approved/rejected

**Common rejection reasons:**

- Missing privacy policy
- Screenshots don't match actual app
- Crashes on test devices
- Violates content policies

---

## Apple App Store Deployment

### 1. Apple Developer Account

**Cost:** $99/year

**Steps:**

1. Go to [Apple Developer](https://developer.apple.com/programs/)
2. Enroll as individual or organization
3. Complete payment
4. Wait for approval (1-2 days)

### 2. Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: CashLens
   - Primary language: Indonesian or English
   - Bundle ID: com.yourname.cashlens (must match app.json)
   - SKU: cashlens-001
   - User access: Full Access

### 3. Build iOS App

```bash
# Build for iOS with EAS
eas build --platform ios --profile production

# This will:
# 1. Prompt you to create Apple credentials
# 2. Generate provisioning profiles
# 3. Build IPA file
```

**Manual alternative (requires macOS):**

```bash
npx expo prebuild --platform ios
cd ios
xcodebuild archive -workspace CashLens.xcworkspace -scheme CashLens
```

### 4. Upload Build

#### Option A: EAS Submit

```bash
eas submit --platform ios
```

#### Option B: Transporter App

1. Download [Transporter](https://apps.apple.com/app/transporter/id1450874784)
2. Drag IPA file into Transporter
3. Click "Deliver"

### 5. Complete App Information

**App Store listing:**

- App name: CashLens
- Subtitle (30 chars): "Smart Expense Tracker"
- Privacy policy URL
- Category: Finance
- Screenshots (required for multiple device sizes)
- App preview video (optional but recommended)
- Description
- Keywords (100 chars, comma-separated)
- Support URL
- Marketing URL (optional)

**Pricing:**

- Price: Free
- Availability: Select countries

**App Review Information:**

- Contact email
- Contact phone
- Notes for reviewer:

  ```
  Test account (if you add auth):
  Email: reviewer@test.com
  Password: TestPass123

  OCR feature: Upload a receipt image via gallery to test scanning.
  ```

**Version information:**

- Copyright: 2026 Your Name
- Rating: Select appropriate age rating

### 6. Submit for Review

1. Click "Submit for Review"
2. Apple's review is **typically faster than Google** (1-3 days)
3. Higher rejection rate than Android

**Common iOS rejection reasons:**

- App crashes on startup
- Features don't work as described
- Requires login but no demo account provided
- Guideline 4.3 (spam/duplicate apps)
- Missing privacy manifest (iOS 17+)

---

## Post-Deployment

### 1. Monitor Crash Reports

**Google Play:**

- Play Console → Quality → Android vitals → Crashes & ANRs

**Apple:**

- App Store Connect → TestFlight → Crash logs
- Xcode → Organizer → Crashes

**Sentry Dashboard:**

- Real-time crash reports
- User impact analysis
- Stack traces

### 2. Track Metrics

**Key metrics to monitor:**

- Daily Active Users (DAU)
- Retention rate (Day 1, Day 7, Day 30)
- Crash-free users %
- Average session duration
- Feature usage (OCR scans, manual entries, cloud sync)

**Tools:**

- Google Analytics for Firebase
- Expo Analytics (built-in)
- Mixpanel or Amplitude (advanced)

### 3. Respond to Reviews

**Best practices:**

- Respond within 24-48 hours
- Thank users for feedback
- Address bugs mentioned in reviews
- Don't argue or be defensive

**Example responses:**

```
⭐⭐⭐⭐⭐ "Great app!"
→ "Thank you for the kind words! We're glad CashLens is helpful for you."

⭐⭐ "OCR doesn't work well"
→ "Thanks for the feedback. Could you email us a sample receipt at support@cashlens.app? We're constantly improving OCR accuracy."
```

### 4. Plan Marketing

**Free channels:**

- ProductHunt launch
- Reddit (r/Indonesia, r/personalfinance)
- Indonesian tech communities (Kaskus, CHIP forums)
- LinkedIn post with demo video
- Share on Twitter/X with screenshots

**Paid (optional):**

- Google App Campaigns ($5-10/day test budget)
- Facebook/Instagram ads targeting Indonesian fintech users

---

## Maintenance & Updates

### Releasing Updates

**Version numbering:**

- Patch (1.0.1): Bug fixes only
- Minor (1.1.0): New features, no breaking changes
- Major (2.0.0): Breaking changes, major redesign

**Update process:**

1. Increment version in `app.json`:

   ```json
   {
     "version": "1.0.1",
     "android": { "versionCode": 2 },
     "ios": { "buildNumber": "2" }
   }
   ```

2. Build new version:

   ```bash
   eas build --platform all --profile production
   ```

3. Submit via Play Console / App Store Connect

4. Add release notes clearly describing changes

### Required Updates

**You must update when:**

- Critical security vulnerability discovered
- Store policy changes
- OS updates break compatibility (new Android/iOS versions)
- Third-party SDK deprecated (Expo SDK upgrades)

**Recommended update frequency:**

- Bug fixes: Within 1 week of discovery
- Feature updates: Every 4-6 weeks
- Major versions: 1-2 times per year

---

## Checklist Summary

### Before First Submission

- [ ] Privacy policy published and linked in app
- [ ] Terms of service (optional but recommended)
- [ ] App icon created (512x512 Android, 1024x1024 iOS)
- [ ] 5-8 screenshots taken
- [ ] Feature graphic created (Android)
- [ ] Store description written (EN + ID)
- [ ] All debug code removed
- [ ] Environment variables secured
- [ ] Crash reporting configured (Sentry)
- [ ] App tested on low-end device
- [ ] Version set to 1.0.0 (versionCode/buildNumber = 1)

### Google Play Store

- [ ] Developer account created ($25)
- [ ] AAB/APK built via EAS or local
- [ ] Keystore created and backed up (if local build)
- [ ] App created in Play Console
- [ ] Store listing completed
- [ ] Content rating questionnaire completed
- [ ] Data safety section filled
- [ ] Release submitted for review

### Apple App Store

- [ ] Developer account created ($99/year)
- [ ] App created in App Store Connect
- [ ] IPA built via EAS
- [ ] App information completed
- [ ] Screenshots for all required device sizes
- [ ] Privacy manifest added (iOS 17+)
- [ ] Test account provided (if needed)
- [ ] Release submitted for review

### Post-Launch

- [ ] Monitor crashes daily (first week)
- [ ] Respond to reviews
- [ ] Track key metrics (DAU, retention)
- [ ] Plan first update based on feedback
- [ ] Share launch announcement

---

## Resources

### Official Documentation

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)

### Tools

- **App Icons:** [AppIcon.co](https://appicon.co/), [EasyAppIcon](https://easyappicon.com/)
- **Screenshots:** [Previewed](https://previewed.app/), [AppMockUp](https://app-mockup.com/)
- **Privacy Policy:** [TermsFeed](https://www.termsfeed.com/), [GetTerms](https://getterms.io/)
- **Analytics:** [Firebase Analytics](https://firebase.google.com/products/analytics), [Mixpanel](https://mixpanel.com/)
- **Crash Reporting:** [Sentry](https://sentry.io/), [BugSnag](https://www.bugsnag.com/)

### Communities

- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://www.reactnative.dev/community/overview)
- [r/reactnative](https://reddit.com/r/reactnative)

---

## Interview Talking Points

When discussing store deployment in interviews:

**What you learned:**

- End-to-end app lifecycle management
- Platform-specific requirements (Android vs iOS)
- User privacy compliance (GDPR, data safety)
- Production build optimization
- Crash monitoring and debugging in production

**Metrics to mention:**

- "Deployed to Google Play Store with X downloads in first month"
- "Maintained 4.5+ star rating with Y reviews"
- "99.x% crash-free rate across Z active users"
- "Iterated based on user feedback, shipped N updates"

**Challenges overcome:**

- "Reduced app size from XMB to YMB for faster downloads"
- "Debugged production-only crash affecting A% of users"
- "Optimized OCR performance for low-end Android devices"

Good luck with your deployment!
