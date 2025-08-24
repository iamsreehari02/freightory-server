import { createRequire } from "module";
import countries from "i18n-iso-countries";
import ContainerCounter from "../models/ContainerCounter.js";
const require = createRequire(import.meta.url);

const enLocale = require("i18n-iso-countries/langs/en.json");

countries.registerLocale(enLocale);

export async function generateContainerId(companyId, countryCode) {
  const code = countryCode.toUpperCase().slice(0, 3);

  const counter = await ContainerCounter.findOneAndUpdate(
    { companyId, countryCode: code },
    { $inc: { lastNumber: 1 } },
    { new: true, upsert: true }
  );

  const paddedNumber = String(counter.lastNumber).padStart(3, "0");
  return `${code}${paddedNumber}`;
}
