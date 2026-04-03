/* eslint-disable no-console */
/* eslint-disable max-lines */
// import { type Transaction } from "@types";

import { type Transaction } from "../types";

const LOG_PREFIX = "[ReceiptParser]";

interface ParsedReceiptData {
  amount?: number;
  categoryId?: string;
  date?: string;
  note?: string;
  time?: string;
  locale?: string;
}

interface LocaleConfig {
  code: string;
  language: "id" | "en";
  currency: string;
  thousandSeparator: string;
  decimalSeparator: string;
  monthNames: Record<string, number>;
  currencyPatterns: RegExp[];
  datePatterns: RegExp[];
}

const LOCALES: Record<string, LocaleConfig> = {
  "id-ID": {
    code: "id-ID",
    language: "id",
    currency: "IDR",
    thousandSeparator: ".",
    decimalSeparator: ",",
    monthNames: {
      jan: 0,
      januari: 0,
      feb: 1,
      februari: 1,
      mar: 2,
      maret: 2,
      apr: 3,
      april: 3,
      mei: 4,
      jun: 5,
      juni: 5,
      jul: 6,
      juli: 6,
      agu: 7,
      agustus: 7,
      sep: 8,
      september: 8,
      okt: 9,
      oktober: 9,
      nov: 10,
      november: 10,
      des: 11,
      desember: 11
    },
    currencyPatterns: [
      /Rp\s*([\d.,]+)/i,
      /IDR\s*([\d.,]+)/i,
      /TOTAL\s+[:\s]*Rp\s*([\d.,]+)/i,
      /JUMLAH\s+[:\s]*Rp\s*([\d.,]+)/i,
      /PEMBAYARAN\s+[:\s]*Rp\s*([\d.,]+)/i
    ],
    datePatterns: [
      /(\d{1,2}\s+(?:jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des)[a-z]*\s+\d{4})/i,
      /(\d{2}[-/]\d{2}[-/]\d{4})/,
      /(\d{2}[-/]\d{2}[-/]\d{2})/
    ]
  },
  "en-US": {
    code: "en-US",
    language: "en",
    currency: "USD",
    thousandSeparator: ",",
    decimalSeparator: ".",
    monthNames: {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11
    },
    currencyPatterns: [
      /\$([\d.,]+)/i,
      /USD\s*([\d.,]+)/i,
      /TOTAL\s+[:\$]*\s*([\d.,]+)/i,
      /AMOUNT\s+[:\$]*\s*([\d.,]+)/i
    ],
    datePatterns: [
      /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
      /(\d{1,2}[-/]\d{1,2}[-/]\d{4})/
    ]
  }
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  cat_food: [
    "ALFAMART",
    "INDOMARET",
    "ALFA",
    "SUPERINDO",
    "RANCH",
    "LOTTE",
    "AEON",
    "FOOD",
    "RESTAURANT",
    "CAFE",
    "STARBUCKS",
    "KOPI",
    "KENANGAN",
    "JANJI",
    "JIWA",
    "FORE",
    "COFFEE",
    "KFC",
    "MCDONALD",
    "BURGER",
    "PIZZA",
    "SUSHI",
    "NOODLE",
    "AYAM",
    "NASI",
    "BAKSO",
    "MIE",
    "SOTO",
    "GADO",
    "SATE",
    "RENDANG",
    "GURAME"
  ],
  cat_transport: [
    "GRAB",
    "GOJEK",
    "BENSIN",
    "PERTAMINA",
    "SHELL",
    "BP",
    "VIVO",
    "AKSES",
    "TOL",
    "PARKIR",
    "OJOL",
    "TAXI",
    "BLUEBIRD",
    "ANGKOT",
    "TRANS",
    "JAKARTA",
    "COMMUTER",
    "KRL",
    "MRT",
    "LRT",
    "DAMRI",
    "METRO",
    "TRANSJAKARTA"
  ],
  cat_shopping: [
    "SHOPPING",
    "MALL",
    "PLAZA",
    "HYPERMART",
    "CARREFOUR",
    "GIANT",
    "PEPITO",
    "UNIQLO",
    "H&M",
    "ZARA",
    "NIKE",
    "ADIDAS",
    "PUMA",
    "FASHION",
    "CLOTHES",
    "BAJU",
    "CELANA",
    "SEPATU",
    "TAS",
    "JAM",
    "TANGAN",
    "PAKAIAN"
  ],
  cat_bills: [
    "LISTRIK",
    "PLN",
    "AIR",
    "PDAM",
    "INTERNET",
    "WIFI",
    "INDIHOME",
    "TELKOM",
    "XL",
    "TELKOMSEL",
    "INDOSAT",
    "TRI",
    "SMARTFREN",
    "PULSA",
    "QUOTA",
    "STREAMING",
    "NETFLIX",
    "SPOTIFY",
    "YOUTUBE",
    "PREMIUM",
    "SUBSCRIPTION"
  ],
  cat_health: [
    "APOTEK",
    "PHARMACY",
    "FARMASI",
    "KIMIA",
    "FARMA",
    "GUARDIAN",
    "WATSON",
    "OBAT",
    "MEDICINE",
    "VITAMIN",
    "SUPPLEMENT",
    "KLINIK",
    "HOSPITAL",
    "RS",
    "DOKTER",
    "DOCTOR",
    "PERIKSA",
    "CHECKUP",
    "LABORATORY",
    "LAB",
    "XRAY"
  ],
  cat_entertainment: [
    "BIOSKOP",
    "CINEMA",
    "XXI",
    "CGV",
    "FXX",
    "MOVIE",
    "FILM",
    "TICKET",
    "KARAOKE",
    "INVISION",
    "NAVY",
    "FAMILY",
    "FUNWORLD",
    "DUFAN",
    "ANCOL",
    "GAME",
    "PLAYSTATION",
    "XBOX",
    "NINTENDO",
    "ARCADE",
    "BOWLING",
    "BILLIARD"
  ],
  cat_education: [
    "BUKU",
    "BOOK",
    "GRAMEDIA",
    "BOOKSTORE",
    "STATIONERY",
    "ALAT",
    "TULIS",
    "PENSIL",
    "PULPEN",
    "KERTAS",
    "NOTEBOOK",
    "SCHOOL",
    "UNIVERSITY",
    "KULIAH",
    "SEKOLAH",
    "COURSE",
    "LES",
    "PRIVAT",
    "TUTOR",
    "ONLINE",
    "CLASS",
    "COURSE"
  ],
  cat_travel: [
    "HOTEL",
    "RESORT",
    "AIRBNB",
    "TIKET",
    "PESAWAT",
    "FLIGHT",
    "AIRLINE",
    "GARUDA",
    "LION",
    "AIR",
    "ASIA",
    "CITILINK",
    "TRAVEL",
    "TOUR",
    "VACATION",
    "LIBURAN",
    "WISATA",
    "TRIP",
    "BACKPACKER",
    "HOSTEL",
    "LODGE",
    "VILLA"
  ],
  cat_personal: [
    "PET",
    "DOG",
    "CAT",
    "FOOD",
    "GROOMING",
    "VET",
    "HEWAN",
    "PELIHARAAN",
    "KUCING",
    "ANJING",
    "IKAN",
    "BURUNG",
    "HAMSTER",
    "RABBIT",
    "KELINCI",
    "SALON",
    "BARBER",
    "HAIRCUT",
    "HAIR",
    "SPA",
    "MASSAGE",
    "REFLEKSI",
    "KOSMETIK",
    "MAKEUP",
    "SKINCARE",
    "PARFUM",
    "PERFUME",
    "SHAMPOO",
    "SABUN"
  ],
  cat_housing: [
    "KOST",
    "KONTRAKAN",
    "RENT",
    "APARTMENT",
    "APARTEMEN",
    "RUMAH",
    "HOUSE",
    "SEWA",
    "RENTAL",
    "DEPOSIT",
    "JAMINAN",
    "SECURITY",
    "LISTRIK",
    "AIR",
    "GAS",
    "ELPIJI",
    "TABBUNG",
    "KEBERSIHAN",
    "CLEANING",
    "SERVICE",
    "PEST"
  ],
  cat_gifts: [
    "GIFT",
    "HADIAH",
    "KADO",
    "FLOWER",
    "BUNGA",
    "CHOCOLATE",
    "COKELAT",
    "BIRTHDAY",
    "ULANG",
    "TAHUN",
    "WEDDING",
    "NIKAH",
    "ANNIVERSARY",
    "XMAS"
  ],
  cat_investment: [
    "SAHAM",
    "STOCK",
    "REKSADANA",
    "MUTUAL",
    "FUND",
    "OBLIGASI",
    "BOND",
    "CRYPTO",
    "BITCOIN",
    "ETHEREUM",
    "FOREX",
    "TRADING",
    "INVESTASI",
    "DEPOSITO",
    "TABUNGAN",
    "EMAS",
    "GOLD",
    "ANTAM",
    "PROPERTY",
    "TANAH"
  ],
  cat_savings: [
    "TABBUNG",
    "SAVE",
    "SAVINGS",
    "DEPOSITO",
    "FIXED",
    "BUNGA",
    "INTEREST",
    "BANK",
    "TRANSFER",
    "ATM",
    "DEBIT",
    "CREDIT",
    "CARD",
    "KARTU",
    "KREDIT"
  ],
  cat_business: [
    "BUSINESS",
    "BISNIS",
    "OFFICE",
    "KANTOR",
    "MEETING",
    "RAPAT",
    "CLIENT",
    "INVOICE",
    "FAKTUR",
    "QUOTATION",
    "PENAWARAN",
    "SUPPLIER",
    "VENDOR",
    "INVENTORY",
    "STOCK",
    "BARANG",
    "MODAL",
    "USAHA",
    "TOKO",
    "STORE",
    "SHOP"
  ]
};

const STORE_PATTERNS = [
  /ALFAMART/i,
  /INDOMARET/i,
  /ALFA/i,
  /SUPERINDO/i,
  /RANCH\s+MARKET/i,
  /LOTTE/i,
  /AEON/i,
  /HYPERMART/i,
  /CARREFOUR/i,
  /GIANT/i,
  /PEPITO/i,
  /STARBUCKS/i,
  /KOPI\s+KENANGAN/i,
  /JANJI\s+JIWA/i,
  /FORE\s+COFFEE/i,
  /RESTAURANT/i,
  /CAFE/i
];

const BANK_LABELS = [
  /PEMBAYARAN\s+KE\s*:\s*(.+)/i,
  /PEMBAYARAN\s+KEPADA\s*:\s*(.+)/i,
  /PENERIMA\s*:\s*(.+)/i,
  /KEPADA\s*:\s*(.+)/i,
  /UNTUK\s*:\s*(.+)/i,
  /DESCRIPTION\s*:\s*(.+)/i
];

const BANK_CLEANUP_PATTERNS = [
  /BCA/i,
  /BRI/i,
  /MANDIRI/i,
  /BNI/i,
  /PERMATA/i,
  /CIMB/i,
  /DANAMON/i,
  /OCBC/i,
  /UOB/i,
  /HSBC/i,
  /CITIBANK/i,
  /RRN/i,
  /REF/i,
  /TRX/i,
  /NO\.\s*REK/i,
  /NO\s*REKENING/i
];

const TIME_PATTERN = /(\d{2}:\d{2}(?::\d{2})?)/;

export function detectLocale(text: string): string {
  console.log(`${LOG_PREFIX} [Locale] Detecting locale...`);

  const textLower = text.toLowerCase();
  const idKeywords = [
    "rp",
    "idr",
    "total pembayaran",
    "jumlah",
    "tunai",
    "kembali",
    "maret",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
    "januari",
    "februari",
    "april"
  ];
  const enKeywords = [
    "$",
    "usd",
    "total",
    "amount",
    "cash",
    "change",
    "march",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "january",
    "february",
    "april"
  ];

  let idScore = 0;
  let enScore = 0;

  for (const keyword of idKeywords) {
    if (textLower.includes(keyword)) {
      idScore++;
    }
  }

  for (const keyword of enKeywords) {
    if (textLower.includes(keyword)) {
      enScore++;
    }
  }

  console.log(`${LOG_PREFIX} [Locale] Scores - ID: ${idScore}, EN: ${enScore}`);

  if (idScore >= enScore) {
    console.log(`${LOG_PREFIX} [Locale] Detected: id-ID`);
    return "id-ID";
  }

  console.log(`${LOG_PREFIX} [Locale] Detected: en-US`);
  return "en-US";
}

function getLocaleConfig(locale: string): LocaleConfig {
  return LOCALES[locale] || LOCALES["id-ID"];
}

function normalizeAmount(rawAmount: string, locale: string): number {
  console.log(
    `${LOG_PREFIX} [Amount] Normalizing: "${rawAmount}" for ${locale}`
  );

  const config = getLocaleConfig(locale);
  const { thousandSeparator, decimalSeparator } = config;

  let cleaned = rawAmount.trim();
  const hasBothSeparators =
    cleaned.includes(thousandSeparator) && cleaned.includes(decimalSeparator);

  if (hasBothSeparators) {
    const lastThousand = cleaned.lastIndexOf(thousandSeparator);
    const lastDecimal = cleaned.lastIndexOf(decimalSeparator);

    if (locale === "id-ID") {
      if (lastDecimal > lastThousand) {
        const decimalPart = cleaned.substring(lastDecimal + 1);
        if (decimalPart === "00") {
          cleaned = cleaned.substring(0, lastDecimal);
        }
        cleaned = cleaned.replace(
          new RegExp(`\\${thousandSeparator}`, "g"),
          ""
        );
        cleaned = cleaned.replace(decimalSeparator, ".");
      } else {
        cleaned = cleaned.replace(
          new RegExp(`\\${thousandSeparator}`, "g"),
          ""
        );
        cleaned = cleaned.replace(decimalSeparator, ".");
      }
    } else {
      if (lastThousand < lastDecimal) {
        const decimalPart = cleaned.substring(lastDecimal + 1);
        if (decimalPart === "00") {
          cleaned = cleaned.substring(0, lastDecimal);
        }
        cleaned = cleaned.replace(
          new RegExp(`\\${thousandSeparator}`, "g"),
          ""
        );
        cleaned = cleaned.replace(decimalSeparator, ".");
      } else {
        cleaned = cleaned.replace(
          new RegExp(`\\${thousandSeparator}`, "g"),
          ""
        );
        cleaned = cleaned.replace(decimalSeparator, ".");
      }
    }
  } else if (cleaned.includes(thousandSeparator)) {
    const parts = cleaned.split(thousandSeparator);
    const lastPart = parts[parts.length - 1];

    if (lastPart.length === 2 && !isNaN(parseInt(lastPart, 10))) {
      cleaned = parts.join("");
    } else {
      cleaned = cleaned.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");
    }
  } else if (cleaned.includes(decimalSeparator)) {
    const parts = cleaned.split(decimalSeparator);
    const decimalPart = parts[parts.length - 1];

    if (decimalPart === "00") {
      cleaned = parts[0];
    } else {
      cleaned = cleaned.replace(decimalSeparator, ".");
    }
  }

  cleaned = cleaned.replace(/[^0-9.]/g, "");
  const amount = parseFloat(cleaned);

  console.log(`${LOG_PREFIX} [Amount] Normalized result: ${amount}`);
  return isNaN(amount) ? 0 : amount;
}

function parseAmountWithLocale(
  text: string,
  locale: string
): number | undefined {
  console.log(`${LOG_PREFIX} [Amount] Parsing with locale: ${locale}`);

  const config = getLocaleConfig(locale);
  let foundAmount: number | undefined;

  for (const pattern of config.currencyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const rawAmount = match[1];
      const amount = normalizeAmount(rawAmount, locale);

      if (amount > 0) {
        if (
          pattern.source.includes("Rp") ||
          pattern.source.includes("IDR") ||
          pattern.source.includes("\\$")
        ) {
          return amount;
        }
        if (!foundAmount || amount > foundAmount) {
          foundAmount = amount;
        }
      }
    }
  }

  if (foundAmount) {
    return foundAmount;
  }

  const allNumbers = text.match(/[\d.,]+/g);
  if (allNumbers) {
    const amounts = allNumbers
      .map((num) => normalizeAmount(num, locale))
      .filter((n) => {
        if (n <= 0) return false;
        if (n >= 1900 && n <= 2100) return false;
        if (n >= 1 && n <= 31) return false;
        return n < 1000000000;
      });

    if (amounts.length > 0) {
      return Math.max(...amounts);
    }
  }

  return undefined;
}

function parseDateWithLocale(text: string, locale: string): string | undefined {
  const config = getLocaleConfig(locale);
  let foundDate: Date | null = null;
  let foundTime: string | undefined;

  const timeMatch = text.match(TIME_PATTERN);
  if (timeMatch && timeMatch[0]) {
    foundTime = timeMatch[0];
  }

  for (const pattern of config.datePatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      const dateStr = match[0];
      const parsedDate = parseDateStringWithLocale(dateStr, config);
      if (parsedDate && (!foundDate || parsedDate > foundDate)) {
        foundDate = parsedDate;
      }
    }
  }

  if (foundDate) {
    const timeStr =
      foundTime || new Date().toTimeString().split(" ")[0].slice(0, 5);
    return foundDate.toISOString().split("T")[0] + "T" + timeStr;
  }

  return undefined;
}

function parseDateStringWithLocale(
  dateStr: string,
  config: LocaleConfig
): Date | null {
  const numericMatch = dateStr.match(/(\d{1,4})[-/](\d{1,2})[-/](\d{1,4})/);
  if (numericMatch) {
    let first = parseInt(numericMatch[1], 10);
    let second = parseInt(numericMatch[2], 10);
    let third = parseInt(numericMatch[3], 10);

    let year: number, month: number, day: number;

    if (config.code === "id-ID") {
      if (third > 31 || third.toString().length === 4) {
        day = first;
        month = second - 1;
        year = third;
      } else {
        day = first;
        month = second;
        year = third > 31 ? third : 2000 + third;
      }
    } else {
      if (first > 31 || first.toString().length === 4) {
        year = first;
        month = second;
        day = third;
      } else {
        month = first;
        day = second;
        year = third > 31 ? third : 2000 + third;
      }
    }

    if (year < 100) year += 2000;
    if (month < 0 || month > 11) return null;
    if (day < 1 || day > 31) return null;

    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  for (const [monthStr, monthIndex] of Object.entries(config.monthNames)) {
    const monthPattern = new RegExp(
      `(\\d{1,2})\\s+${monthStr}\\s+(\\d{4})`,
      "i"
    );
    const match = dateStr.match(monthPattern);
    if (match) {
      const day = parseInt(match[1], 10);
      const year = parseInt(match[2], 10);
      const date = new Date(year, monthIndex, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

function detectCategory(text: string): string {
  console.log(`${LOG_PREFIX} [Category] Detecting category...`);

  const textUpper = text.toUpperCase();
  const categoryScores: Record<string, number> = {};

  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (textUpper.includes(keyword)) {
        score++;
        console.log(
          `${LOG_PREFIX} [Category] Match: "${keyword}" → ${categoryId}`
        );
      }
    }
    if (score > 0) {
      categoryScores[categoryId] = score;
    }
  }

  const sortedCategories = Object.entries(categoryScores).sort(
    (a, b) => b[1] - a[1]
  );

  if (sortedCategories.length > 0) {
    const winner = sortedCategories[0][0];
    console.log(`${LOG_PREFIX} [Category] ✓ Detected: ${winner}`);
    return winner;
  }

  console.log(
    `${LOG_PREFIX} [Category] No match, defaulting to cat_other_expense`
  );
  return "cat_other_expense";
}

function parseStoreName(text: string): string | undefined {
  for (const labelPattern of BANK_LABELS) {
    for (const line of text.split("\n")) {
      const match = line.match(labelPattern);
      if (match && match[1]) {
        let storeName = match[1].trim();
        for (const cleanup of BANK_CLEANUP_PATTERNS) {
          storeName = storeName.replace(cleanup, "").trim();
        }
        storeName = storeName.replace(/[:\-\s]+$/, "").trim();
        if (storeName.length > 2 && storeName.length < 100) {
          return storeName;
        }
      }
    }
  }

  const lines = text.split("\n");
  for (const line of lines.slice(0, 10)) {
    for (const pattern of STORE_PATTERNS) {
      if (pattern.test(line)) {
        return line.trim().substring(0, 50);
      }
    }
  }

  return undefined;
}

export function parseReceipt(text: string): ParsedReceiptData {
  console.log(`\n${LOG_PREFIX} ========================================`);
  console.log(`${LOG_PREFIX} START PARSING`);
  console.log(`${LOG_PREFIX} ========================================\n`);

  const locale = detectLocale(text);
  const amount = parseAmountWithLocale(text, locale);
  const date = parseDateWithLocale(text, locale);
  const note = parseStoreName(text);
  const categoryId = detectCategory(text);

  console.log(`\n${LOG_PREFIX} ========================================`);
  console.log(`${LOG_PREFIX} RESULTS:`);
  console.log(`${LOG_PREFIX}   Locale: ${locale}`);
  console.log(`${LOG_PREFIX}   Amount: ${amount ?? "NOT FOUND"}`);
  console.log(`${LOG_PREFIX}   Category: ${categoryId}`);
  console.log(`${LOG_PREFIX}   Date: ${date ?? "NOT FOUND"}`);
  console.log(`${LOG_PREFIX}   Store: ${note ?? "NOT FOUND"}`);
  console.log(`${LOG_PREFIX} ========================================\n`);

  return {
    amount,
    categoryId,
    date,
    note,
    locale
  };
}

export function extractReceiptData(
  text: string
): Partial<Transaction> & { receiptImageUri?: string } {
  console.log(`${LOG_PREFIX} Extracting transaction data...`);

  const parsed = parseReceipt(text);

  const result = {
    amount: parsed.amount || 0,
    amountInBaseCurrency: parsed.amount || 0,
    categoryId: parsed.categoryId || "cat_other_expense",
    date: parsed.date || new Date().toISOString(),
    note: parsed.note,
    isFromScan: true
  };

  console.log(`${LOG_PREFIX} Result:`, JSON.stringify(result, null, 2));
  return result;
}
