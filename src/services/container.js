import User from "../models/User.js";
import { Container } from "../models/Container.js";
import { generateContainerId } from "../utils/generateContainerId.js";

export const createContainer = async (data, user) => {
  const containerId = await generateContainerId(user.country);

  console.log("company ", user);
  const container = new Container({
    containerId,
    country: data.country,
    port: data.port,
    unitsAvailable: data.unitsAvailable,
    availableFrom: data.availableFrom,
    status: data.status || "available",
    createdBy: user._id,
    companyId: user.companyId,
  });

  return await container.save();
};

export const getNextContainerId = async (userId) => {
  const user = await User.findById(userId).populate("company").lean();
  if (!user || user.role !== "nvocc") throw new Error("Unauthorized");

  const country = user.companyId?.country || user.country;
  if (!country) throw new Error("User country not found");

  return await generateContainerId(country);
};
