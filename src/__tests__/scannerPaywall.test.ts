type SubscriptionTier = "free" | "premium";

interface Quota {
  scansUsed: number;
  scansLimit: number | null;
}

function isScanBlocked(
  subscriptionTier: SubscriptionTier,
  stealthScansUsed: number,
  premiumQuota: Quota
): boolean {
  const freeTrialExhausted =
    subscriptionTier === "free" && stealthScansUsed >= 5;
  const premiumExhausted =
    subscriptionTier === "premium" &&
    premiumQuota.scansLimit !== null &&
    premiumQuota.scansUsed >= premiumQuota.scansLimit;
  return freeTrialExhausted || premiumExhausted;
}

describe("scanner paywall", () => {
  describe("free user", () => {
    it("allows scan when under limit", () => {
      expect(isScanBlocked("free", 4, { scansUsed: 0, scansLimit: null })).toBe(
        false
      );
    });

    it("blocks scan at exactly 5 stealth scans", () => {
      expect(isScanBlocked("free", 5, { scansUsed: 0, scansLimit: null })).toBe(
        true
      );
    });

    it("blocks scan above 5 stealth scans", () => {
      expect(
        isScanBlocked("free", 10, { scansUsed: 0, scansLimit: null })
      ).toBe(true);
    });
  });

  describe("premium user", () => {
    it("allows scan when under quota", () => {
      expect(
        isScanBlocked("premium", 0, { scansUsed: 49, scansLimit: 50 })
      ).toBe(false);
    });

    it("blocks scan when quota exhausted", () => {
      expect(
        isScanBlocked("premium", 0, { scansUsed: 50, scansLimit: 50 })
      ).toBe(true);
    });

    it("blocks scan when over quota", () => {
      expect(
        isScanBlocked("premium", 0, { scansUsed: 55, scansLimit: 50 })
      ).toBe(true);
    });

    it("allows scan when limit is null (unlimited)", () => {
      expect(
        isScanBlocked("premium", 0, { scansUsed: 999, scansLimit: null })
      ).toBe(false);
    });
  });
});
