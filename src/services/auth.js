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

  return {
    id: user._id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  };
};

// export const registerCompanyAndUser = async (data) => {
//   const {
//     companyName,
//     contactPerson,
//     phone,
//     email,
//     website,
//     headOfficeAddress,
//     country,
//     pinCode,
//     freightType,
//     password,
//   } = data;

//   const existingUser = await User.findOne({ email });
//   if (existingUser) throw new Error("Email already in use");

//   const company = await Company.create({
//     companyName,
//     contactPerson,
//     website,
//     headOfficeAddress,
//     country,
//     pinCode,
//     freightType,
//   });

//   const hashedPassword = await bcrypt.hash(password, 12);

//   const user = await User.create({
//     companyId: company._id,
//     email,
//     phone,
//     password: hashedPassword,
//   });

//   return { user, company };
// };

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

//     let baseRegistrationFee = 0;
//     let costPerBranch = 0;
//     let finalBranchCount = branchCount;

//     const normalizedFreightType = freightType
//       .toLowerCase()
//       .replace(/\s+/g, "_");

//     if (normalizedFreightType === "freight_forwarder") {
//       baseRegistrationFee = 10000;
//       costPerBranch = 5000;
//     } else if (normalizedFreightType === "nvocc") {
//       // Fix: use normalizedFreightType here too
//       baseRegistrationFee = 20000;
//       costPerBranch = 0;
//       finalBranchCount = 0;
//     }

//     const totalCost = baseRegistrationFee + finalBranchCount * costPerBranch;

//     const company = await Company.create(
//       [
//         {
//           companyName,
//           contactPerson,
//           website,
//           headOfficeAddress,
//           country,
//           pinCode,
//           freightType: normalizedFreightType, // Store normalized version for consistency
//           costPerBranch,
//           baseRegistrationFee,
//           totalRegistrationCost: totalCost,
//         },
//       ],
//       { session }
//     );

//     const branchesToCreate = Array.from({ length: finalBranchCount }).map(
//       () => ({
//         companyId: company[0]._id,
//       })
//     );

//     // Only create branches if there are any to create
//     if (finalBranchCount > 0) {
//       const createdBranches = await Branch.insertMany(branchesToCreate, {
//         session,
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create(
//       [
//         {
//           companyId: company[0]._id,
//           email,
//           phone,
//           password: hashedPassword,
//           role: normalizedFreightType,
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return {
//       user: user[0],
//       company: company[0],
//       branchCount: finalBranchCount,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     console.log("error in ", error);
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
      branchCount = 1,
    } = data;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("Email already in use");

    const currency = getCurrencyCodeFromCountry(country);

    let baseFee = 0;
    let costPerBranch = 0;
    let finalBranchCount = branchCount;

    const normalizedFreightType = freightType
      .toLowerCase()
      .replace(/\s+/g, "_");

    // Base values in main unit (e.g. ₹ or $)
    if (normalizedFreightType === "freight_forwarder") {
      baseFee = 10000;
      costPerBranch = 5000;
    } else if (normalizedFreightType === "nvocc") {
      baseFee = 20000;
      costPerBranch = 0;
      finalBranchCount = 0;
    }

    // Convert to minor units (paise or cents)
    const baseRegistrationFee = baseFee * 100;
    const costPerBranchInMinor = costPerBranch * 100;
    const totalCost =
      baseRegistrationFee + finalBranchCount * costPerBranchInMinor;

    const company = await Company.create(
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
        },
      ],
      { session }
    );

    const branchesToCreate = Array.from({ length: finalBranchCount }).map(
      () => ({
        companyId: company[0]._id,
      })
    );

    if (finalBranchCount > 0) {
      await Branch.insertMany(branchesToCreate, { session });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create(
      [
        {
          companyId: company[0]._id,
          email,
          phone,
          password: hashedPassword,
          role: normalizedFreightType,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      user: user[0],
      company: company[0],
      branchCount: finalBranchCount,
    };
  } catch (error) {
    await session.abortTransaction();
    console.log("error in ", error);
    session.endSession();
    throw error;
  }
};
