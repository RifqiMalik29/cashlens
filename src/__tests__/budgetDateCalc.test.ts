type BudgetPeriod = "weekly" | "monthly" | "yearly";

function calcEndDate(startDate: string, period: BudgetPeriod): Date {
  const start = new Date(startDate);
  const end = new Date(start);
  if (period === "weekly") {
    end.setDate(start.getDate() + 6);
  } else if (period === "monthly") {
    end.setMonth(start.getMonth() + 1, 0);
  } else if (period === "yearly") {
    end.setFullYear(start.getFullYear() + 1, 0, 0);
  }
  return end;
}

describe("budget endDate calculation", () => {
  describe("weekly", () => {
    it("ends 6 days after start", () => {
      const end = calcEndDate("2026-04-01", "weekly");
      expect(end.getFullYear()).toBe(2026);
      expect(end.getMonth()).toBe(3); // April = 3
      expect(end.getDate()).toBe(7);
    });

    it("wraps correctly across month boundary", () => {
      const end = calcEndDate("2026-04-28", "weekly");
      expect(end.getMonth()).toBe(4); // May = 4
      expect(end.getDate()).toBe(4);
    });
  });

  describe("monthly", () => {
    it("ends on last day of same month", () => {
      const end = calcEndDate("2026-04-01", "monthly");
      expect(end.getFullYear()).toBe(2026);
      expect(end.getMonth()).toBe(3); // April
      expect(end.getDate()).toBe(30);
    });

    it("handles months with 31 days", () => {
      const end = calcEndDate("2026-01-01", "monthly");
      expect(end.getDate()).toBe(31);
    });

    it("handles February in non-leap year", () => {
      const end = calcEndDate("2026-02-01", "monthly");
      expect(end.getDate()).toBe(28);
    });

    it("handles February in leap year", () => {
      const end = calcEndDate("2024-02-01", "monthly");
      expect(end.getDate()).toBe(29);
    });
  });

  describe("yearly", () => {
    it("ends on Dec 31 of same year", () => {
      const end = calcEndDate("2026-04-01", "yearly");
      expect(end.getFullYear()).toBe(2026);
      expect(end.getMonth()).toBe(11); // December
      expect(end.getDate()).toBe(31);
    });
  });
});
