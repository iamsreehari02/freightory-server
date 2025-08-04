import User from "../models/User.js";
import { getCurrencyFromCountryCode } from "../utils/currency.js";

export const getUsers = async (latest = false) => {
  const query = {
    isDeleted: false,
    role: { $ne: "admin" },
  };

  if (latest) {
    query.createdAt = {
      $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    };
  }

  const users = await User.find(query, "-password")
    .populate({
      path: "companyId",
      select: `
        _id
        companyName
        contactPerson
        website
        headOfficeAddress
        country
        pinCode
        freightType
        costPerBranch
        baseRegistrationFee
        totalRegistrationCost
      `,
    })
    .lean();

  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      let company = null;

      if (user.companyId) {
        const { currencyCode, symbol } = await getCurrencyFromCountryCode(
          user.companyId.country
        );

        company = {
          _id: user.companyId._id,
          name: user.companyId.companyName,
          contactPerson: user.companyId.contactPerson,
          website: user.companyId.website,
          headOfficeAddress: user.companyId.headOfficeAddress,
          country: user.companyId.country,
          pinCode: user.companyId.pinCode,
          freightType: user.companyId.freightType,
          costPerBranch: user.companyId.costPerBranch,
          baseRegistrationFee: user.companyId.baseRegistrationFee,
          totalRegistrationCost: user.companyId.totalRegistrationCost,
          currencyCode,
          currencySymbol: symbol,
        };
      }

      return {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        status: user.isSuspended ? "suspended" : "active",
        company,
      };
    })
  );

  return enrichedUsers;
};

export const getUserById = async (userId) => {
  const user = await User.findOne(
    { _id: userId, isDeleted: false },
    "-password"
  )
    .populate({
      path: "companyId",
      select: `
        _id
        companyName
        contactPerson
        website
        headOfficeAddress
        country
        pinCode
        freightType
        costPerBranch
        baseRegistrationFee
        totalRegistrationCost
      `,
    })
    .lean();

  if (!user) throw new Error("User not found");

  let company = null;

  if (user.companyId) {
    const { currencyCode, symbol } = await getCurrencyFromCountryCode(
      user.companyId.country
    );

    company = {
      _id: user.companyId._id,
      name: user.companyId.companyName,
      contactPerson: user.companyId.contactPerson,
      website: user.companyId.website,
      headOfficeAddress: user.companyId.headOfficeAddress,
      country: user.companyId.country,
      pinCode: user.companyId.pinCode,
      freightType: user.companyId.freightType,
      costPerBranch: user.companyId.costPerBranch,
      baseRegistrationFee: user.companyId.baseRegistrationFee,
      totalRegistrationCost: user.companyId.totalRegistrationCost,
      currencyCode,
      currencySymbol: symbol,
    };
  }

  return {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    status: user.isSuspended ? "suspended" : "active",
    company,
  };
};

export const getUserCount = async () => {
  return await User.countDocuments({ isDeleted: false });
};

export const deleteUser = async (userId) => {
  return await User.findByIdAndUpdate(userId, { isDeleted: true });
};

// export const deleteUser = async (userId) => {
//   const user = await User.findByIdAndUpdate(userId, { isDeleted: true });

//   if (!user) throw new Error("User not found");

//   // If your app has one user per company, delete the company too
//   if (user.companyId) {
//     await Company.findByIdAndUpdate(user.companyId, { isDeleted: true });
//   }

//   return user;
// };

export const suspendUser = async (userId, suspend = true) => {
  return await User.findByIdAndUpdate(userId, { isSuspended: suspend });
};
