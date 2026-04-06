import { type Currency } from "@types";

export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = "id-ID"
): string {
  const currencies: Record<string, Currency> = {
    IDR: { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
    USD: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    GBP: { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    SGD: { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
    MYR: { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
    AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
    KRW: { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
    THB: { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
    HKD: { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" }
  };

  const currency = currencies[currencyCode];
  if (!currency) {
    return `${currencyCode} ${amount.toLocaleString(locale)}`;
  }

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return `${currency.symbol} ${formatted}`;
}

export function formatCompactCurrency(
  amount: number,
  currencyCode: string
): string {
  const currencies: Record<string, { symbol: string }> = {
    IDR: { symbol: "Rp" },
    USD: { symbol: "$" },
    EUR: { symbol: "€" },
    GBP: { symbol: "£" },
    JPY: { symbol: "¥" },
    SGD: { symbol: "S$" },
    MYR: { symbol: "RM" },
    AUD: { symbol: "A$" },
    CNY: { symbol: "¥" },
    KRW: { symbol: "₩" },
    THB: { symbol: "฿" },
    HKD: { symbol: "HK$" }
  };

  const currency = currencies[currencyCode]?.symbol || currencyCode;

  let formatted: string;
  if (amount >= 1_000_000_000) {
    formatted = `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  } else if (amount >= 1_000_000) {
    formatted = `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  } else if (amount >= 1_000) {
    formatted = `${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  } else {
    formatted = amount.toString();
  }

  return `${currency} ${formatted}`;
}
