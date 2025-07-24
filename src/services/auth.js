import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Company from "../models/Company.js";

export const registerUser = async (email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await User.create({ email, password: hashedPassword });

  return { id: newUser._id, email: newUser.email };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return { id: user._id, email: user.email };
};

export const registerCompanyAndUser = async (data) => {
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
  } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const company = await Company.create({
    companyName,
    contactPerson,
    website,
    headOfficeAddress,
    country,
    pinCode,
    freightType,
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    companyId: company._id,
    email,
    phone,
    password: hashedPassword,
  });

  return { user, company };
};
