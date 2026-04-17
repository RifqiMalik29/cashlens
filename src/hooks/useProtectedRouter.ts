import { useRouter } from "expo-router";
import { useRef } from "react";

const NAVIGATION_LOCKOUT_MS = 500;

export function useProtectedRouter() {
  const router = useRouter();
  const isNavigating = useRef(false);

  function guard(fn: () => void) {
    if (isNavigating.current) return;
    isNavigating.current = true;
    fn();
    setTimeout(() => {
      isNavigating.current = false;
    }, NAVIGATION_LOCKOUT_MS);
  }

  return {
    ...router,
    push: (...args: Parameters<typeof router.push>) =>
      guard(() => router.push(...args)),
    replace: (...args: Parameters<typeof router.replace>) =>
      guard(() => router.replace(...args))
  };
}
