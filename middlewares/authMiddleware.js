const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log("Request header:", req.headers);

  if (!token) {
    console.error("Token not found");
    return res.status(401).json({ error: "Unauthorized: User not logged in!" });
  }

  console.log("Received Token:", token); // Log the token

  try {
    const decoded = jwt.verify(token, "shh");
    console.log("Token is valid. Decoded user data:", decoded);

    // Fetch the user by ID using promises
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      console.error("User not found in the database");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user; // Attach the user data to the request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = { validateToken };
