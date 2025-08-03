import { getUserCount, getUsers } from "../services/users.js";

export const getUsersController = async (req, res) => {
  try {
    const latest = req.query.latest === "true";
    const users = await getUsers(latest);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserCountController = async (req, res) => {
  try {
    const count = await getUserCount();
    res.json({ count });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).json({ message: "Server error" });
  }
};
