import Company from "../models/Company.js";
import { Container } from "../models/Container.js";
// import { bulkEmailQueue } from "../queues/bulkEmailQueue.js";
import {
  createContainer,
  getAllContainerLogsService,
  getContainerByIdService,
  getLatestContainers,
  getNextContainerId,
  softDeleteContainer,
  updateContainerStatus,
} from "../services/container.js";
import { sendEmailTemplate } from "../services/email.js";
import { getAllFreightForwarders } from "../services/users.js";
import { containerEmailTemplate } from "../templates/containerCreatedTemplate.js";

// export const addContainer = async (req, res) => {
//   try {
//     const container = await createContainer(req.body, {
//       _id: req.user.userId,
//       companyId: req.user.companyId,
//       country: req.body.country,
//     });

//     res.status(201).json(container);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

export const addContainer = async (req, res) => {
  try {
    const container = await createContainer(req.body, {
      _id: req.user.userId,
      companyId: req.user.companyId,
      country: req.body.country,
    });

    res.status(201).json(container);

    const freightForwarders = await getAllFreightForwarders();

    if (freightForwarders.length === 0) {
      console.warn("No freight forwarders found to send emails");
      return;
    }

    for (const ff of freightForwarders) {
      const htmlTemplate = containerEmailTemplate({
        containerNumber: container.containerId,
        origin: container.port?.name || "N/A",
        destination: container.country || "N/A",
        createdBy: req.user.companyName,
        agentDetails: container.agentDetails || "N/A",
      });

      sendEmailTemplate({
        to: ff.email,
        subject: "New Container Created",
        htmlTemplate,
      }).catch((err) => {
        console.error(`Failed to send email to ${ff.email}:`, err.message);
      });
    }
  } catch (err) {
    console.error("Error creating container:", err);
    res.status(400).json({ message: err.message });
  }
};

export const fetchNextContainerId = async (req, res) => {
  try {
    const nextId = await getNextContainerId(req.user.userId);
    res.status(200).json({ containerId: nextId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllContainers = async (req, res) => {
  try {
    const containers = await Container.find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .populate("companyId", "companyName")
      .populate({
        path: "port",
        select: "name country",
      });
    res.status(200).json(containers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCompanyContainers = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const containers = await Container.find({
      isDeleted: { $ne: true },
      companyId,
    })
      .sort({ createdAt: -1 })
      .populate("companyId", "companyName")
      .populate({
        path: "port",
        select: "name country",
      });

    res.status(200).json(containers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleUpdateContainerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const companyId = req.user.companyId;

  try {
    const allowed = ["available", "in-use", "maintenance"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedContainer = await updateContainerStatus(id, status, companyId);

    res.status(200).json({
      message: "Container status updated",
      container: updatedContainer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleGetAllContainerLogs = async (req, res) => {
  try {
    const { role, companyId } = req.user;

    let logs;
    if (role === "admin") {
      // Admin can see all company container logs
      logs = await getAllContainerLogsService();
    } else {
      // Normal users see only their company's logs
      logs = await getAllContainerLogsService(companyId);
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching container logs:", error);
    res.status(500).json({ message: "Failed to fetch container logs" });
  }
};

export const getLatestContainersController = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const companyId = req.user.companyId;

    console.log("User companyId:", req.user.companyId);

    const containers = await getLatestContainers(companyId, skip, limit);
    res.status(200).json(containers);
  } catch (error) {
    console.error("Error fetching latest containers:", error);
    res.status(500).json({ message: "Failed to fetch latest containers" });
  }
};

export const getContainerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const container = await getContainerByIdService(id, companyId);

    if (!container) {
      return res.status(404).json({ message: "Container not found" });
    }

    res.status(200).json(container);
  } catch (error) {
    console.error("Error fetching container by ID:", error);
    res.status(500).json({ message: "Failed to fetch container" });
  }
};

export async function deleteContainer(req, res) {
  const companyId = req.user.companyId;

  try {
    const container = await softDeleteContainer(req.params.id, companyId);

    if (!container) {
      return res
        .status(404)
        .json({ message: "Container not found or not authorized" });
    }

    res.json({ message: "Container moved to trash", container });
  } catch (error) {
    res.status(500).json({ message: "Error deleting container", error });
  }
}
