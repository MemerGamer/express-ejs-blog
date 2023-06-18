import { __dirname } from "../app.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// get

async function loginPage(_req, res, _next) {
  res.locals = {
    title: "Login",
  };
  res.render("auth");
}

async function registerPage(_req, res, _next) {
  res.locals = {
    title: "Register",
  };
  res.render("auth");
}

// post
async function login(_req, res, _next) {
  const { username, password } = _req.body;
  try {
    const user = await UserModel.findOne(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // save jwt token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // redirect to home page
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function register(req, res, _next) {
  const { username, name, email, password } = req.body;
  try {
    const user = await UserModel.createUser({
      username,
      name,
      email,
      password,
    });
    console.log(user);
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // save jwt token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // redirect to home page
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default {
  login,
  register,
  loginPage,
  registerPage,
};
