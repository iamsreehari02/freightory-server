import User from "../models/User.js";

export const getUsers = async (latest = false) => {
  const query = {
    isDeleted: false,
    role: { $ne: "admin" },
  };

  let findQuery = User.find(query, "-password")
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
        currency
      `,
    })
    .sort({ createdAt: -1 })
    .lean();

  // If latest = true → fetch only the last 5 users
  if (latest) {
    findQuery = findQuery.sort({ createdAt: -1 }).limit(5);
  }

  const users = await findQuery;

  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      let company = null;

      if (user.companyId) {
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
          branchCount: user.companyId.branchCount || 0,
          baseRegistrationFee: user.companyId.baseRegistrationFee,
          totalRegistrationCost: user.companyId.totalRegistrationCost,
          currency: user.companyId.currency,
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
        currency
      `,
    })
    .lean();

  if (!user) throw new Error("User not found");

  let company = null;

  if (user.companyId) {
    // const { currencyCode, symbol } = await getCurrencyFromCountryCode(
    //   user.companyId.country
    // );

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
      currencyCode: user.companyId.currency,
      // currencySymbol: symbol,
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

export const getAllFreightForwarders = async () => {
  try {
    const freightForwarders = await User.find({
      role: "freight_forwarder",
      isDeleted: false,
      isSuspended: false,
    }).select("email"); // Only fetch email

    return freightForwarders;
  } catch (error) {
    console.error("Error fetching freight forwarders:", error);
    throw new Error("Failed to fetch freight forwarders");
  }
};
