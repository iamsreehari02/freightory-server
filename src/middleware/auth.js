import { getTokenFromCookie } from "../config/cookie.js";
import { verifyJwt } from "../config/jwt.js";

export const requireAuth = (req, res, next) => {
  const token = getTokenFromCookie(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = verifyJwt(token);
  if (!decoded || !decoded.userId || !decoded.role) {
    return res.status(401).json({ message: "Invalid or incomplete token" });
  }

  req.user = {
    userId: String(decoded.userId),
    role: decoded.role,
    companyId: decoded.companyId,
  };

  next();
};
