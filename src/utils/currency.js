export async function getCurrencyFromCountryCode(code) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const data = await res.json();
    const currencyCode = Object.keys(data[0].currencies)[0];
    const symbol = data[0].currencies[currencyCode].symbol;
    return { currencyCode, symbol };
  } catch (error) {
    console.error("Error fetching currency:", error);
    return { currencyCode: "USD", symbol: "$" };
  }
}

const countryToCurrency = {
  india: "INR",
  "united states": "USD",
  "united arab emirates": "AED",
  "united kingdom": "GBP",
  canada: "CAD",
  // Add more as needed
};

export function getCurrencyCodeFromCountry(country) {
  return countryToCurrency[country.toLowerCase()] || "USD"; // default fallback
}

const currencyToLocaleMap = {
  USD: "en-US",
  INR: "en-IN",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  AUD: "en-AU",
  CAD: "en-CA",
  CNY: "zh-CN",
};

export function formatCurrency(amount, currencyCode = "USD") {
  const locale = currencyToLocaleMap[currencyCode] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export const formatCurrencyINR = (amount, currency) => {
  try {
    // If INR, show code instead of ₹
    if (currency === "INR") {
      return `INR ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // For other currencies, show symbol properly
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (err) {
    console.error("Currency formatting failed:", err);
    return `${currency} ${amount}`;
  }
};

// Unified function that handles both conversion and formatting
export function formatCurrencyFromSmallestUnit(
  amountInSmallestUnit,
  currencyCode = "USD"
) {
  try {
    // Convert from smallest unit (paisa/cents) to main unit
    const mainAmount = amountInSmallestUnit / 100;

    // Special handling for INR to avoid ₹ symbol issues in PDFs
    if (currencyCode === "INR") {
      return `INR ${mainAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    // For other currencies, use standard formatting
    const locale = currencyToLocaleMap[currencyCode] || "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(mainAmount);
  } catch (err) {
    console.error("Currency formatting failed:", err);
    // Fallback: convert amount and show with currency code
    const mainAmount = amountInSmallestUnit / 100;
    return `${currencyCode} ${mainAmount.toFixed(2)}`;
  }
}
