Act as a Senior React Native Developer.

### Objective

Fix the persistent **Camera Black Screen** issue in the `ScannerScreen` for the CashLens app.

### Analysis of the Issue:

The UI (overlay, buttons) is visible, but the `CameraView` is rendering as a black screen. This typically happens in Tab-based navigation because the camera session doesn't automatically restart when navigating back to the tab, or the component isn't layout-ready.

### Requirements:

1.  **Tab Focus Management (`ScannerScreen.tsx`)**:
    - Import `useIsFocused` from `@react-navigation/native` (or check if available in `expo-router`).
    - **Conditional Rendering**: Only render the `CameraView` when `isFocused` is true. This ensures the camera session starts/stops correctly when switching tabs.
    - Add a `key` prop to `CameraView` that changes when the screen is focused (e.g., `<CameraView key={isFocused ? 'active' : 'inactive'} ... />`) to force a clean mount.

2.  **Layout Fixes**:
    - Use `StyleSheet.absoluteFill` from `react-native` instead of just NativeWind classes for the `CameraView` to ensure it captures the full layout dimensions immediately.
    - Ensure the `CameraView` is the first child of the root `View`.

3.  **Camera Configuration**:
    - Explicitly set `active={true}` if supported by the version, or ensure `facing="back"` is correctly handled.
    - Add an `onCameraReady` callback to log/verify the camera is actually ready.

4.  **Error Handling**:
    - If the camera fails to start after a few seconds, provide a "Refresh Camera" button to the user.

### Guidelines:

- **Performance**: Avoid unnecessary re-renders.
- **Reliability**: Focus on the lifecycle of the camera session within Expo Router tabs.

Please provide the updated `ScannerScreen.tsx` and any necessary adjustments to `useScannerScreen.ts`.
