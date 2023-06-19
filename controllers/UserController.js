import { __dirname } from "../app.js";
import UserModel from "../models/UserModel.js";

async function displayProfile(req, res, _next) {
  const token = req.cookies.token;
  const isLoggedIn = !!req.cookies.token;
  const userToDisplay = await UserModel.getUserById(req.params.id);
  const postWrittenByUserID = await UserModel.getPostsByUserID(req.params.id);

  if (isLoggedIn) {
    const user = await UserModel.getUserByToken(token);
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
      user: userToDisplay[0],
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isEditor: isEditor,
      id: user.id,
      posts: postWrittenByUserID,
    };
  } else {
    res.locals = {
      title: "Profile",
      user: userToDisplay[0],
      isLoggedIn: isLoggedIn,
      isAdmin: false,
      isEditor: false,
      id: -1,
      posts: postWrittenByUserID,
    };
  }

  res.render("user");
}

export default {
  displayProfile,
};
