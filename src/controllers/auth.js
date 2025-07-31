import { Branch } from "../models/Branch.js";
import User from "../models/User.js";
import {
  loginUser,
  registerCompanyAndUser,
  registerUser,
} from "../services/auth.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    req.session.userId = user.id;
    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    req.session.userId = user.id;
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

export const getMe = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

// export const register = async (req, res) => {
//   try {
//     const { user, company } = await registerCompanyAndUser(req.body);

//     req.session.userId = user._id;
//     req.session.companyId = company._id;

//     res.status(201).json({
//       message: "Registered successfully",
//       userId: user._id,
//       companyId: company._id,
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const register = async (req, res) => {
  try {
    const { user, company, branchCount } = await registerCompanyAndUser(
      req.body
    );

    const totalCost =
      company.baseRegistrationFee + branchCount * company.costPerBranch;

    // Set session
    req.session.userId = user._id;
    req.session.companyId = company._id;

    res.status(201).json({
      message: "Registered successfully",
      userId: user._id,
      companyId: company._id,
      branchInfo: {
        count: branchCount,
        costPerBranch: company.costPerBranch,
        baseRegistrationFee: company.baseRegistrationFee,
        totalCost,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
