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
  updateUserAndCompanyService,
} from "../services/auth.js";
import { deleteUser, suspendUser } from "../services/users.js";

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

    const token = signJwt({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });
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

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);

    console.log(`User ${userId} deleted by ${req.user.userId}`);
    res.json({ message: "User soft deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const suspendUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { suspend } = req.body;

    await suspendUser(userId, suspend);

    console.log(
      `User ${userId} ${suspend ? "suspended" : "reactivated"} by ${req.user.userId}`
    );
    res.json({ message: suspend ? "User suspended" : "User reactivated" });
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const sendEmailController = async (req, res) => {
//   try {
//     const { to, subject, text, html } = req.body;
//     await sendEmailToUser({ to, subject, text, html });
//     res.json({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Email sending failed" });
//   }
// };

export const updateUserAndCompany = async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { userData, companyData } = req.body;

    const { updatedUser, updatedCompany } = await updateUserAndCompanyService({
      userId,
      companyId,
      userData,
      companyData,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

