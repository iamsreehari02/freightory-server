import { ContainerLog } from "../models/ContainerLog.js";

export const logContainerActivity = async ({
  containerId,
  action,
  message,
  createdBy,
  companyId,
}) => {
  return await ContainerLog.create({
    containerId,
    action,
    message,
    createdBy,
    companyId,
  });
};
