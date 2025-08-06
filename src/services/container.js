import User from "../models/User.js";
import { Container } from "../models/Container.js";
import { generateContainerId } from "../utils/generateContainerId.js";
import { logContainerActivity } from "../utils/containerLogUpdater.js";
import { ContainerLog } from "../models/ContainerLog.js";

export const createContainer = async (data, user) => {
  const containerId = await generateContainerId(user.country);

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

  const savedContainer = await container.save();

  // Include port in log message
  await logContainerActivity({
    containerId: savedContainer._id,
    action: "created",
    message: `Container ${containerId} created at ${data.port} port`,
    createdBy: user._id,
  });

  return savedContainer;
};

export const getNextContainerId = async (userId) => {
  const user = await User.findById(userId).populate("company").lean();
  if (!user || user.role !== "nvocc") throw new Error("Unauthorized");

  const country = user.companyId?.country || user.country;
  if (!country) throw new Error("User country not found");

  return await generateContainerId(country);
};

export const updateContainerStatus = async (id, status) => {
  const container = await Container.findByIdAndUpdate(
    id,
    {
      $set: { status },
      $push: {
        activityLog: {
          action: status,
          message: `Status updated to ${status}`,
        },
      },
    },
    { new: true, runValidators: true } // return updated doc
  );

  if (!container) {
    throw new Error("Container not found");
  }

  return container;
};

// Get container stats
// export const getContainerStats = async () => {
//   const total = await Container.countDocuments();
//   const available = await Container.countDocuments({ status: "available" });
//   const inUse = await Container.countDocuments({ status: "in-use" });
//   const maintenance = await Container.countDocuments({ status: "maintenance" });

//   return { total, available, inUse, maintenance };
// };

export const getAllContainerLogsService = async () => {
  const logs = await ContainerLog.find()
    .populate("createdBy", "name")
    .populate("containerId", "containerId")
    .sort({ createdAt: -1 });

  return logs;
};
