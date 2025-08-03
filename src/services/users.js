import User from "../models/User.js";

export const getUsers = async (latest = false) => {
  const query = latest
    ? {
        createdAt: {
          $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        role: { $ne: "admin" }, // exclude admin
      }
    : {
        role: { $ne: "admin" }, // exclude admin
      };

  const users = await User.find(query, "-password")
    .populate({
      path: "companyId",
      select: "companyName country freightType",
    })
    .lean();

  return users.map((user) => ({
    _id: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    status: "active", // placeholder
    company: user.companyId
      ? {
          name: user.companyId.companyName,
          country: user.companyId.country,
          freightType: user.companyId.freightType,
        }
      : null,
  }));
};

export const getUserCount = async () => {
  return await User.countDocuments();
};
