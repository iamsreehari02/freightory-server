import User from "../models/User.js";
import { Container } from "../models/Container.js";
import { generateContainerId } from "../utils/generateContainerId.js";
import { logContainerActivity } from "../utils/containerLogUpdater.js";
import { ContainerLog } from "../models/ContainerLog.js";
import { Port } from "../models/Port.js";
import mongoose from "mongoose";

// export const createContainer = async (data, user) => {
//   const containerId = await generateContainerId(user.country);

//   const container = new Container({
//     containerId,
//     country: data.country,
//     port: data.port,
//     unitsAvailable: data.unitsAvailable,
//     availableFrom: data.availableFrom,
//     status: data.status || "available",
//     createdBy: user._id,
//     companyId: user.companyId,
//   });

//   const savedContainer = await container.save();

//   // Include port in log message
//   await logContainerActivity({
//     containerId: savedContainer._id,
//     action: "created",
//     message: `Container ${containerId} created at ${data.port} port`,
//     createdBy: user._id,
//   });

//   return savedContainer;
// };

// export const createContainer = async (data, user) => {
//   let port;

//   // Check if data.port looks like a valid ObjectId (existing port)
//   if (mongoose.Types.ObjectId.isValid(data.port)) {
//     port = await Port.findOne({
//       _id: data.port,
//       companyId: user.companyId,
//     });
//   }

//   // If port not found, treat data.port as a new port name
//   if (!port) {
//     // Create new port with given name and country & companyId from user
//     port = new Port({
//       name: data.port,
//       country: data.country,
//       companyId: user.companyId,
//     });
//     await port.save();
//   }

//   const containerId = await generateContainerId(user.country);

//   const container = new Container({
//     containerId,
//     country: data.country,
//     port: port._id, // store the port reference
//     unitsAvailable: data.unitsAvailable,
//     availableFrom: data.availableFrom,
//     status: data.status || "available",
//     createdBy: user._id,
//     companyId: user.companyId,
//   });

//   const savedContainer = await container.save();

//   // Populate port field
//   await savedContainer.populate("port");

//   await logContainerActivity({
//     containerId: savedContainer._id,
//     action: "created",
//     message: `Container ${containerId} created at ${port.name} port`,
//     createdBy: user._id,
//   });

//   return savedContainer;
// };

export const createContainer = async (data, user) => {
  let port;

  // Check if data.port looks like a valid ObjectId (existing port)
  if (mongoose.Types.ObjectId.isValid(data.port)) {
    port = await Port.findOne({
      _id: data.port,
      companyId: user.companyId,
    });
  }

  // If port not found, treat data.port as a new port name
  if (!port) {
    port = new Port({
      name: data.port,
      country: data.country,
      companyId: user.companyId,
    });
    await port.save();
  }

  const containerId = await generateContainerId(data.country, user.companyId);

  const container = new Container({
    containerId,
    country: data.country,
    port: port._id,
    unitsAvailable: data.unitsAvailable,
    availableFrom: data.availableFrom,
    status: data.status || "available",
    createdBy: user._id,
    companyId: user.companyId,
    specialRate: data.specialRate,
    agentDetails: data.agentDetails,
  });

  const savedContainer = await container.save();

  await savedContainer.populate("port");

  await logContainerActivity({
    companyId: user.companyId,
    containerId: savedContainer._id,
    action: "created",
    message: `Container ${containerId} created at ${port.name} port`,
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

export const updateContainerStatus = async (id, status, companyId) => {
  const container = await Container.findOneAndUpdate(
    { _id: id, companyId },
    {
      $set: { status },
      $push: {
        activityLog: {
          action: status,
          message: `Status updated to ${status}`,
        },
      },
    },
    { new: true, runValidators: true }
  );

  if (!container) {
    throw new Error("Container not found or not authorized");
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
export const getAllContainerLogsService = async (companyId) => {
  const logs = await ContainerLog.find()
    .populate("createdBy", "name")
    .populate({
      path: "containerId",
      match: { companyId }, // filter by company
      select: "containerId port",
      populate: {
        path: "port",
        select: "name country",
      },
    })
    .sort({ createdAt: -1 });

  // Remove logs with null containerId (those not matching the company)
  return logs.filter((log) => log.containerId);
};

export const getLatestContainers = async (companyId, skip = 0, limit = 20) => {
  return await Container.find({
    isDeleted: { $ne: true },
    companyId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("companyId", "companyName")
    .populate("port", "name country");
};

export const getContainerByIdService = async (id, companyId) => {
  return await Container.findOne({
    _id: id,
    isDeleted: { $ne: true },
    companyId,
  })
    .populate("companyId", "companyName")
    .populate({
      path: "port",
      select: "name country",
    });
};

export async function softDeleteContainer(id, companyId) {
  return Container.findOneAndUpdate(
    { _id: id, companyId },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
}
