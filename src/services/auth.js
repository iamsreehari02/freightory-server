import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Company from "../models/Company.js";
import mongoose from "mongoose";
import { Branch } from "../models/Branch.js";
import { getCurrencyCodeFromCountry } from "../utils/currency.js";

export const registerUser = async (email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({ email, password: hashedPassword });

  return { id: newUser._id, email: newUser.email };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("This email is not registered");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const company = await Company.findById(user.companyId).select("companyName");
  if (!company) throw new Error("Company not found");

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    companyName: company.companyName,
  };
};

// export const registerCompanyAndUser = async (data) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       companyName,
//       contactPerson,
//       phone,
//       email,
//       website,
//       headOfficeAddress,
//       country,
//       pinCode,
//       freightType,
//       password,
//       branchCount = 1,
//     } = data;

//     const existingUser = await User.findOne({ email }).session(session);
//     if (existingUser) throw new Error("Email already in use");

//     const currency = getCurrencyCodeFromCountry(country);

//     let baseFee = 0;
//     let costPerBranch = 0;
//     let finalBranchCount = branchCount;

//     const normalizedFreightType = freightType
//       .toLowerCase()
//       .replace(/\s+/g, "_");

//     if (normalizedFreightType === "freight_forwarder") {
//       baseFee = 10000;
//       costPerBranch = 5000;
//     } else if (normalizedFreightType === "nvocc") {
//       baseFee = 20000;
//       costPerBranch = 0;
//       finalBranchCount = 0;
//     }

//     const baseRegistrationFee = baseFee; // already in paisa or cents
//     const costPerBranchInMinor = costPerBranch; // already in minor units
//     const totalCost =
//       baseRegistrationFee + finalBranchCount * costPerBranchInMinor;

//     const [company] = await Company.create(
//       [
//         {
//           companyName,
//           contactPerson,
//           website,
//           headOfficeAddress,
//           country,
//           pinCode,
//           freightType: normalizedFreightType,
//           currency,
//           baseRegistrationFee,
//           costPerBranch: costPerBranchInMinor,
//           totalRegistrationCost: totalCost,
//           paymentStatus: "pending",
//         },
//       ],
//       { session }
//     );

//     if (finalBranchCount > 0) {
//       const branchesToCreate = Array.from({ length: finalBranchCount }).map(
//         () => ({ companyId: company._id })
//       );
//       await Branch.insertMany(branchesToCreate, { session });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const [user] = await User.create(
//       [
//         {
//           companyId: company._id,
//           email,
//           phone,
//           password: hashedPassword,
//           role: normalizedFreightType,
//         },
//       ],
//       { session }
//     );

//     // Instead of committing here, return session so emails can be sent first
//     return {
//       user,
//       company,
//       branchCount: finalBranchCount,
//       session,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const registerCompanyAndUser = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      companyName,
      contactPerson,
      phone,
      email,
      website,
      headOfficeAddress,
      country,
      pinCode,
      freightType,
      password,
      branchCount = 0, // default 0
    } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("Email already in use");

    const currency = getCurrencyCodeFromCountry(country);

    // Determine if India or not
    const isIndia = country?.toLowerCase() === "india";

    let baseFee = 0;
    let costPerBranch = 0;
    let finalBranchCount = branchCount;

    const normalizedFreightType = freightType
      ?.toLowerCase()
      .replace(/\s+/g, "_");

    // Calculate fees based on freight type & country
    if (normalizedFreightType === "freight_forwarder") {
      baseFee = isIndia ? 10000 : 100; // already in minor units? use *100 if not
      costPerBranch = isIndia ? 5000 : 50;
    } else if (normalizedFreightType === "nvocc") {
      baseFee = isIndia ? 20000 : 200;
      costPerBranch = 0;
      finalBranchCount = 0; // no branches for NVOCC
    }

    // Convert to minor units (paisa/cents)
    const baseRegistrationFee = baseFee * 100;
    const costPerBranchInMinor = costPerBranch * 100;
    const totalCost =
      baseRegistrationFee + finalBranchCount * costPerBranchInMinor;

    // Create company
    const [company] = await Company.create(
      [
        {
          companyName,
          contactPerson,
          website,
          headOfficeAddress,
          country,
          pinCode,
          freightType: normalizedFreightType,
          currency,
          baseRegistrationFee,
          costPerBranch: costPerBranchInMinor,
          totalRegistrationCost: totalCost,
          paymentStatus: "pending",
        },
      ],
      { session }
    );

    // Create branches if needed
    if (finalBranchCount > 0) {
      const branchesToCreate = Array.from({ length: finalBranchCount }).map(
        () => ({ companyId: company._id })
      );
      await Branch.insertMany(branchesToCreate, { session });
    }

    // Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const [user] = await User.create(
      [
        {
          companyId: company._id,
          email,
          phone,
          password: hashedPassword,
          role: normalizedFreightType,
        },
      ],
      { session }
    );

    return {
      user,
      company,
      branchCount: finalBranchCount,
      session,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updateUserAndCompanyService = async ({
  userId,
  companyId,
  userData = {},
  companyData = {},
}) => {
  let updatedUser = null;
  let updatedCompany = null;

  // Update user if userData is provided
  if (Object.keys(userData).length > 0) {
    updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }
  }

  // Update company if companyData is provided
  if (Object.keys(companyData).length > 0) {
    updatedCompany = await Company.findByIdAndUpdate(companyId, companyData, {
      new: true,
      runValidators: true,
    });
    if (!updatedCompany) {
      throw new Error("Company not found");
    }
  }

  return { updatedUser, updatedCompany };
};
