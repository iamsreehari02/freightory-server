import { Container } from "../models/Container.js";
import { createContainer, getNextContainerId } from "../services/container.js";

export const addContainer = async (req, res) => {
  try {
    console.log("company id", req.user.companyId);
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
    const containers = await Container.find()
      .sort({ createdAt: -1 })
      .populate("companyId", "companyName");
    res.status(200).json(containers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
