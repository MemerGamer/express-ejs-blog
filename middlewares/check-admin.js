import jwt from "jsonwebtoken";
import logger from "../utils/logging.js";
import UserModel from "../models/UserModel.js";

export default async function checkAdmin(req, res, next) {
  // console.log("Checking Admin");
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

    // check if the user has admin role
    const role = await UserModel.getUserRoleByToken(token);
    // console.log(role);

    if (role !== "admin") {
      return res.redirect("/");
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
