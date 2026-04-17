export interface ParsedDraft {
  source: string;
  amount: number;
  currency: string;
  description: string;
  descriptionParams?: Record<string, string>;
  type: "income" | "expense";
  date: string;
}

const PARSERS = [
  {
    // BCA Mobile
    name: "BCA",
    package: "com.bca.mobile",
    testPackage: "com.cashlens.app",
    regex: /Transfer Rp ([\d.,]+) ke (.*) BERHASIL/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: "drafts.bcaTo",
      descriptionParams: { target: match[2].trim() },
      type: "expense"
    })
  },
  {
    // GoPay
    name: "GoPay",
    package: "com.gojek.app",
    regex: /Pembayaran Rp([\d.,]+) di (.*) sukses/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: `GoPay: ${match[2].trim()}`,
      type: "expense"
    })
  },
  {
    // OVO
    name: "OVO",
    package: "com.grb.ovo",
    regex: /Berhasil bayar Rp ([\d.,]+) ke (.*)/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: "drafts.ovoPayment",
      descriptionParams: { target: match[2].trim() },
      type: "expense"
    })
  },
  {
    // DANA
    name: "DANA",
    package: "id.dana",
    regex: /Pembayaran Rp ([\d.,]+) di (.*) berhasil/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: "drafts.danaPayment",
      descriptionParams: { target: match[2].trim() },
      type: "expense"
    })
  },
  {
    // Bank Jago Spending
    name: "Jago",
    package: "com.jago.app",
    regex: /Uang keluar Rp([\d.,]+) untuk (.*)/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: "drafts.jagoSpending",
      descriptionParams: { target: match[2].trim() },
      type: "expense"
    })
  },
  {
    // ShopeePay
    name: "ShopeePay",
    package: "com.shopee.id",
    regex: /Pembayaran sebesar Rp ([\d.,]+) ke (.*) telah berhasil/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: "drafts.shopeePayment",
      descriptionParams: { target: match[2].trim() },
      type: "expense"
    })
  },
  {
    // General Income (e.g., Transfer masuk)
    name: "Income",
    package: "",
    regex: /Transfer masuk Rp ([\d.,]+)/i,
    extract: (match: RegExpMatchArray): Partial<ParsedDraft> => ({
      amount: parseFloat(match[1].replace(/\./g, "").replace(/,/g, ".")),
      currency: "IDR",
      description: "drafts.incomingTransfer",
      type: "income"
    })
  }
];

export function parseNotification(
  text: string,
  packageName: string
): ParsedDraft | null {
  for (const parser of PARSERS) {
    const isTargetPackage =
      parser.package === "" ||
      packageName.includes(parser.package) ||
      (parser.testPackage && packageName.includes(parser.testPackage));

    if (isTargetPackage) {
      const match = text.match(parser.regex);
      if (match) {
        const details = parser.extract(match);
        return {
          source: parser.name,
          amount: details.amount || 0,
          currency: details.currency || "IDR",
          description: details.description || text,
          descriptionParams: details.descriptionParams,
          type: details.type || "expense",
          date: new Date().toISOString()
        };
      }
    }
  }
  return null;
}
