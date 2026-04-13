import { formatCompactCurrency, formatCurrency } from "@utils/formatCurrency";

describe("formatCurrency", () => {
  it("formats IDR correctly", () => {
    expect(formatCurrency(150000, "IDR")).toBe("Rp 150.000");
  });

  it("formats USD correctly", () => {
    expect(formatCurrency(1500, "USD")).toBe("$ 1.500");
  });

  it("formats zero", () => {
    expect(formatCurrency(0, "IDR")).toBe("Rp 0");
  });

  it("falls back to currency code for unknown currency", () => {
    expect(formatCurrency(100, "XYZ")).toBe("XYZ 100");
  });
});

describe("formatCompactCurrency", () => {
  it("formats thousands with K", () => {
    expect(formatCompactCurrency(15000, "IDR")).toBe("Rp 15K");
  });

  it("formats millions with M", () => {
    expect(formatCompactCurrency(2500000, "IDR")).toBe("Rp 2.5M");
  });

  it("formats billions with B", () => {
    expect(formatCompactCurrency(1000000000, "IDR")).toBe("Rp 1B");
  });

  it("formats exact million without decimal", () => {
    expect(formatCompactCurrency(1000000, "IDR")).toBe("Rp 1M");
  });

  it("formats small amounts as-is", () => {
    expect(formatCompactCurrency(500, "USD")).toBe("$ 500");
  });

  it("falls back to currency code for unknown currency", () => {
    expect(formatCompactCurrency(1000, "XYZ")).toBe("XYZ 1K");
  });
});
