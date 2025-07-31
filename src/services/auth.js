import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Company from "../models/Company.js";
import mongoose from "mongoose";
import { Branch } from "../models/Branch.js";

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

  return { id: user._id, email: user.email };
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
      // costPerBranch,
    } = data;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("Email already in use");

    let baseRegistrationFee = 0;
    let costPerBranch = 0;
    let finalBranchCount = branchCount;

    const normalizedFreightType = freightType
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (normalizedFreightType === "freight_forwarder") {
      baseRegistrationFee = 10000;
      costPerBranch = 5000;
    } else if (freightType === "nvooc") {
      baseRegistrationFee = 20000;
      costPerBranch = 0;
      finalBranchCount = 0;
    }

    const totalCost = baseRegistrationFee + finalBranchCount * costPerBranch;

    const company = await Company.create(
      [
        {
          companyName,
          contactPerson,
          website,
          headOfficeAddress,
          country,
          pinCode,
          freightType,
          costPerBranch,
          baseRegistrationFee,
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

    const createdBranches = await Branch.insertMany(branchesToCreate, {
      session,
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create(
      [
        {
          companyId: company[0]._id,
          email,
          phone,
          password: hashedPassword,
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
