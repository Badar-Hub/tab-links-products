// middleware/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), "your-secret-key");

    // Attach the decoded user information to the request for further use in routes
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
