import { __dirname } from "../app.js";
import UserModel from "../models/UserModel.js";

async function displayProfile(req, res, _next) {
  const token = req.cookies.token;
  const user = await UserModel.getUserByToken(token);
  const isLoggedIn = user ? true : false;
  res.locals = {
    title: "Profile",
    user: user,
    isLoggedIn: isLoggedIn,
  };
  res.render("user");
}

export default {
  displayProfile,
};
