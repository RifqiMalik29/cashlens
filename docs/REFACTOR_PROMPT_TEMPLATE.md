# Fix: Migrate to Gemini 3.1 Flash-Lite & Fix 404 Model Error

## Role

Senior AI Engineer / React Native Developer

## Issue

The application is currently trying to use an outdated or non-existent model ID `gemini-2.0-flash-lite-preview-02-05`, resulting in a 404 error from the Google Generative AI API:
`[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent: [404 ] models/gemini-2.0-flash-lite-preview-02-05 is not found for API version v1beta`

## Goal

Upgrade the application to use the latest **Gemini 3.1 Flash-Lite** model, which offers better performance, "Thinking Levels," and a reliable 500 RPD (Requests Per Day) limit on the free tier.

## Instructions

1.  **Update `src/services/gemini.ts`:**
    - Change the model initialization to use the Gemini 3.1 Flash-Lite model ID.
    - **From:**
      ```typescript
      const model = genAI.getGenerativeModel(
        {
          model: "gemini-2.0-flash-lite-preview-02-05",
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024
          }
        },
        { apiVersion: "v1beta" }
      );
      ```
    - **To:**
      ```typescript
      const model = genAI.getGenerativeModel(
        {
          model: "gemini-3.1-flash-lite-preview",
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        },
        { apiVersion: "v1beta" }
      );
      ```
      _(Note: Keeping `v1beta` as it is often required for preview models like 3.1.)_

2.  **Optimize JSON Handling:**
    - Since we are using `responseMimeType: "application/json"`, the model will return raw JSON.
    - Ensure `parseReceiptImage` and `parseReceiptText` handle the response safely:
      ````typescript
      const response = await result.response;
      const text = response.text();
      // Safe parse even if model still includes markdown markers
      const cleanedJson = text.includes("```")
        ? text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
        : text.trim();
      const parsed = JSON.parse(cleanedJson) as GeminiReceiptResponse;
      ````

3.  **Update Documentation (Optional but Recommended):**
    - Search for any other references to `gemini-2.0-flash` or similar in `docs/AI_SCANNER_IMPLEMENTATION.md` and update them to `gemini-3.1-flash-lite-preview` where appropriate.

## Expected Output

- AI parsing functions correctly without 404 errors.
- The 500 RPD limit is respected and utilized.
- Receipt extraction is faster and more accurate due to the model upgrade.

## Step-by-Step Testing

1.  **Direct AI Test:** Scan a receipt and verify the log shows success for `Step 2/3: Analyzing text with Gemini AI...`.
2.  **Verify Model:** Confirm in the logs (or by adding a temporary log) that `gemini-3.1-flash-lite-preview` is being called.
3.  **Check JSON Structure:** Verify that the extracted `amount`, `merchant`, and `category` fields are correct.
