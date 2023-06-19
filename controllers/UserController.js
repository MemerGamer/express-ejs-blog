import { __dirname } from "../app.js";
import UserModel from "../models/UserModel.js";

async function displayProfile(req, res, _next) {
  const token = req.cookies.token;
  const user = await UserModel.getUserByToken(token);
  const isLoggedIn = user ? true : false;
  const userRole = await UserModel.getUserRoleByToken(token);

  let isAdmin, isEditor;

  if (!userRole) {
    return res.redirect("/auth/login");
  }
  if (userRole === "admin") {
    isAdmin = true;
    isEditor = false;
  }
  if (userRole === "editor") {
    isAdmin = false;
    isEditor = true;
  }
  res.locals = {
    title: "Profile",
    user: user,
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin,
    isEditor: isEditor,
  };
  res.render("user");
}

export default {
  displayProfile,
};
