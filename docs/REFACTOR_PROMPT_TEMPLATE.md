Act as a Senior React Native Developer.

### Objective

Implement the **Receipt Scanner** feature (Thread #4). This involves taking or selecting a photo of a receipt, extracting text using ML Kit, parsing the results to find relevant transaction data (Amount, Date), and auto-filling the transaction form.

### Requirements:

1.  **Scanner UI (`src/screens/Scanner/ScannerScreen.tsx`)**:
    - Implement a camera view with `expo-camera`.
    - Include a "Gallery" button to pick images from the device library using `expo-image-picker`.
    - Add a stylized overlay (frame/box) to guide the user in positioning the receipt.
    - Show a loading indicator/animation while processing the image.

2.  **OCR & Parsing Logic**:
    - Implement `src/services/ocr.ts` to integrate `@react-native-ml-kit/text-recognition`.
    - Implement `src/services/receiptParser.ts` using Regex and rule-based logic to extract the **Total Amount** and **Date** from the raw text blocks.
    - Ensure the parser is robust against different receipt formats common in Indonesia (e.g., Alfamart, Indomaret, Resto receipts).

3.  **Navigation & Form Auto-fill**:
    - Once processing is finished, navigate to `TransactionFormScreen.tsx`.
    - Pass the extracted data (amount, date, and optionally the image URI) to the form's state.
    - Mark the transaction as `isFromScan: true`.

4.  **Shared Components (`src/components/scanner/`)**:
    - `ScannerOverlay.tsx`: The UI frame over the camera.
    - `ScanningProgress.tsx`: A visual indicator during text recognition.

### Guidelines:

- **Styling**: Use NativeWind v4 `className` for all UI elements.
- **Offline First**: Text recognition MUST happen on-device using ML Kit (no external API calls).
- **Separation of Concerns**: OCR logic should be in `services/`, and scanner state should be in `useScannerScreen.ts`.
- **UX**: Provide clear feedback (e.g., Vibration or Sound) when a scan is successful.

Please provide the implementation for the scanner screen, the OCR and parsing services, and the logic to auto-fill the transaction form.
