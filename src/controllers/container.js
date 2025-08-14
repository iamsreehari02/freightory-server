import { Container } from "../models/Container.js";
import {
  createContainer,
  getAllContainerLogsService,
  getContainerByIdService,
  getLatestContainers,
  getNextContainerId,
  softDeleteContainer,
  updateContainerStatus,
} from "../services/container.js";

export const addContainer = async (req, res) => {
  try {
    const container = await createContainer(req.body, {
      _id: req.user.userId,
      companyId: req.user.companyId,
      country: req.body.country,
    });

    res.status(201).json(container);
  } catch (err) {
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

export const handleUpdateContainerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const allowed = ["available", "in-use", "maintenance"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedContainer = await updateContainerStatus(id, status);

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
    const logs = await getAllContainerLogsService();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch container logs" });
  }
};

export const getLatestContainersController = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 20;

    const containers = await getLatestContainers(skip, limit);
    res.status(200).json(containers);
  } catch (error) {
    console.error("Error fetching latest containers:", error);
    res.status(500).json({ message: "Failed to fetch latest containers" });
  }
};


export const getContainerByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const container = await getContainerByIdService(id);

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
  try {
    const container = await softDeleteContainer(req.params.id);
    if (!container) {
      return res.status(404).json({ message: "Container not found" });
    }
    res.json({ message: "Container moved to trash", container });
  } catch (error) {
    res.status(500).json({ message: "Error deleting container", error });
  }
}