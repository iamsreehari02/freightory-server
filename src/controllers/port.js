import { getPortsByCompanyAndCountry } from "../services/port.js";

export const getPorts = async (req, res) => {
  const companyId = req.user.companyId;
  const country = req.query.country;

  try {
    const ports = await getPortsByCompanyAndCountry(companyId, country);
    res.json(ports);
  } catch (error) {
    console.error("Error fetching ports:", error);
    res.status(500).json({ message: "Failed to fetch ports" });
  }
};
