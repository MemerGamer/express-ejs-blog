import jwt from "jsonwebtoken";
import logger from "../utils/logging.js";

export default function checkJwt(req, res, next) {
  const token = req.cookies.token; // Extract the token from the cookies

  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is expired
    if (decoded.exp <= Date.now() / 1000) {
      // Token is expired, log out the user
      // Clear stored token or session
      res.clearCookie("token");
      // Optionally, you can redirect the user to the login page
      return res.redirect("/auth/login");
    }

    // Token is valid, proceed with the request
    req.user = decoded; // Store the decoded user data for future use
    next();
  } catch (error) {
    res.clearCookie("token");
    // Optionally, you can redirect the user to the login page
    return res.redirect("/auth/login");
  }
}
