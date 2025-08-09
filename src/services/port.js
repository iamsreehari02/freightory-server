import { Port } from "../models/Port.js";

export const getPortsByCompanyAndCountry = async (companyId, country) => {
  const filter = { companyId };
  if (country) {
    filter.country = { $regex: new RegExp(`^${country}$`, "i") };
  }
  return await Port.find(filter).sort({ name: 1 });
};
