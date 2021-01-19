const config = require("config");
const jwt = require("jsonwebtoken");

const Response = require("../utils/Response");

function auth(req, res, next) {
  let response = new Response("", []);
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    response.message = "No token, authorization denied";
    return res.status(401).json(response);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    response.message = "Token is not valid";
    return res.status(400).json(response);
  }
}

module.exports = auth;
