import {
  clearTokenCookie,
  getTokenFromCookie,
  setTokenCookie,
} from "../config/cookie.js";
import { signJwt, verifyJwt } from "../config/jwt.js";
import Company from "../models/Company.js";
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

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await loginUser(email, password);
//     req.session.userId = user.id;
//     res.status(200).json({ message: "Login successful", user });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);

    console.log("user in login", user);

    const token = signJwt({ userId: user.id, role: user.role });
    setTokenCookie(res, token);

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// export const logout = (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("connect.sid");
//     res.status(200).json({ message: "Logged out" });
//   });
// };

export const logout = (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ message: "Logged out" });
};

// export const getMe = async (req, res) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ message: "Not logged in" });
//   }

//   try {
//     const user = await User.findById(req.session.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ user });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching user", error: err.message });
//   }
// };

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

export const getMe = async (req, res) => {
  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ message: "Not logged in" });

  const decoded = verifyJwt(token);
  if (!decoded)
    return res.status(401).json({ message: "Token invalid or expired" });

  try {
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const company = await Company.findById(user.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
      user,
      company,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { user, company, branchCount } = await registerCompanyAndUser(
      req.body
    );

    const totalCost =
      company.baseRegistrationFee + branchCount * company.costPerBranch;

    res.status(201).json({
      message:
        "Registration successful. Please login to access your dashboard.",
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
