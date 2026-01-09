const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ ADD THIS

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id, role, tokenVersion }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ IMPORTANT CHANGE (LOGOUT SUPPORT)
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }

    // attach full user (better than decoded)
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
