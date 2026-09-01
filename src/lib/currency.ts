export type CurrencyOption = {
  code: string;
  name: string;
  symbol: string;
  common: boolean;
};

const commonCurrencyCodes = [
  "NGN",
  "GHS",
  "KES",
  "ZAR",
  "USD",
  "GBP",
  "EUR",
  "AED",
  "CAD",
  "AUD",
] as const;

const supportedCurrencyCodes = Intl.supportedValuesOf("currency");
const supportedCurrencySet = new Set(supportedCurrencyCodes);

export function getCurrencyOptions(currentCurrency?: string) {
  const currentCode = currentCurrency?.trim().toUpperCase();
  const orderedCodes = [
    ...commonCurrencyCodes,
    ...supportedCurrencyCodes
      .filter(
        (code) =>
          !commonCurrencyCodes.includes(
            code as (typeof commonCurrencyCodes)[number],
          ),
      )
      .sort((first, second) =>
        getCurrencyName(first).localeCompare(getCurrencyName(second)),
      ),
  ];

  if (currentCode && !orderedCodes.includes(currentCode)) {
    orderedCodes.unshift(currentCode);
  }

  return orderedCodes.map((code) => ({
    code,
    name: getCurrencyName(code),
    symbol: getCurrencySymbol(code),
    common: commonCurrencyCodes.includes(
      code as (typeof commonCurrencyCodes)[number],
    ),
  })) satisfies CurrencyOption[];
}

export function isSupportedCurrencyCode(value: string) {
  return supportedCurrencySet.has(value.trim().toUpperCase());
}

export function formatCurrencyPreview(currency: string, amount = 120000) {
  const code = currency.trim().toUpperCase();

  try {
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);

    return `${formatted} (${code})`;
  } catch {
    return `${code} ${amount.toLocaleString("en")}`;
  }
}

function getCurrencyName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "currency" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function getCurrencySymbol(code: string) {
  try {
    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? code
    );
  } catch {
    return code;
  }
}
