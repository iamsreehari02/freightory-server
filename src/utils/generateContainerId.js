import { createRequire } from "module";
import countries from "i18n-iso-countries";
import { Container } from "../models/Container.js";
const require = createRequire(import.meta.url);

const enLocale = require("i18n-iso-countries/langs/en.json");

countries.registerLocale(enLocale);

export const generateContainerId = async (countryName) => {
  const alpha3 = countries.getAlpha3Code(countryName, "en");

  if (!alpha3) {
    throw new Error("Invalid country name for container ID generation");
  }

  const prefix = alpha3;

  const lastContainer = await Container.findOne({
    containerId: { $regex: `^${prefix}\\d+$` },
  })
    .sort({ createdAt: -1 })
    .lean();

  const lastNumber = lastContainer
    ? parseInt(lastContainer.containerId.replace(prefix, ""))
    : 0;

  const nextNumber = lastNumber + 1;
  const nextId = `${prefix}${nextNumber.toString().padStart(3, "0")}`;

  return nextId;
};
