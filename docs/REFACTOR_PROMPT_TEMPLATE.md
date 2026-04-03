Act as a Senior React Native Developer.

### Objective

Fix the layout warning in `app/(tabs)/_layout.tsx` and stabilize the redundant/failing sync calls in the `CloudSync` logic.

### Requirements:

1.  **Fix Layout Warning (`app/(tabs)/_layout.tsx`)**:
    - The warning "Layout children must be of type Screen" is occurring because `Tabs` is wrapped in another component (like `SafeAreaView` or a fragment) or contains logic between the tags.
    - Ensure the `Tabs` component is the **direct return** of the layout function.
    - Move any styling or SafeArea logic into the `screenOptions` of the `Tabs` component (using `tabBarStyle`).

2.  **Stabilize Cloud Sync (`src/hooks/useCloudSync.ts` & `src/services/syncService.ts`)**:
    - **Redundant Calls**: The logs show "Pulling all data..." triggering multiple times simultaneously. Implement a **lock** or a check to prevent `pullData` from running if a sync is already in progress.
    - **Network Errors**: The "TypeError: Network request failed" suggests the app is trying to sync before the connection is stable or hitting Supabase too aggressively. Add a simple **retry logic with exponential backoff** for network failures.
    - **Initialization**: Ensure `useCloudSync` only triggers the initial pull once when the app mounts and the user is authenticated. Use a `ref` or a state to track initialization.

3.  **Refine Error Logging**:
    - Instead of flood-logging `console.error` for every failed request, group them or only log once per sync attempt to keep the console clean.

### Guidelines:

- **Expo Router**: Follow the strict rule that `<Tabs />` must only contain `<Tabs.Screen />` children.
- **Performance**: Use `useCallback` and `useEffect` dependencies correctly to avoid infinite sync loops.

Please provide the corrected `app/(tabs)/_layout.tsx` and the stabilized `useCloudSync` hook logic.
