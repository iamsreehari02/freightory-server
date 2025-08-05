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
