const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticateToken = function (req, res, next) {
  // Check if the request contains cookies
  if (req.cookies && req.cookies.token) {
    // Extract the token from the cookies
    const token = req.cookies.token;

    try {
      // Verify the token using JWT secret
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          // If the token is invalid or expired
          return res.status(401).json({ error: "Invalid or expired token" });
        } else {
          const { email, id, name } = decodedToken;
          const user = await User.findOne({ email: email });
          if (!user) {
            return res
              .status(404)
              .json({ error: "User not found, please login" });
          }
          req.user = user;
          next();
        }
      });
    } catch (ex) {
      console.error(ex);
      return res.status(500).json({
        error: "Internal Server Error. Please try again later",
      });
    }
  } else {
    return res.status(403).json({ error: "No token found" });
  }
};

module.exports = authenticateToken;
