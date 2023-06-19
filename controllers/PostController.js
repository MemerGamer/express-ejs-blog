import { __dirname } from "../app.js";
import PostModel from "../models/PostModel.js";
import CommentModel from "../models/CommentModel.js";
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";

async function landingPage(_req, res, _next) {
  const posts = await PostModel.getAllPosts();
  // a user is logged in if there is token in the cookies
  let isAdmin, isEditor;
  const isLoggedIn = !!_req.cookies.token;
  if (isLoggedIn) {
    const userRole = await UserModel.getUserRoleByToken(_req.cookies.token);
    const user = await UserModel.getUserByToken(_req.cookies.token);

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
      title: "Blog",
      posts: posts,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isEditor: isEditor,
      id: user.id,
    };
  } else {
    isAdmin = false;
    isEditor = false;
    res.locals = {
      title: "Blog",
      posts: posts,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isEditor: isEditor,
      id: -1,
    };
  }

  res.render("index");
}

async function postBySlug(req, res, _next) {
  const { slug } = req.params;
  //console.log(slug);
  const post = await PostModel.getPostBySlug(slug);
  const isLoggedIn = !!req.cookies.token;

  if (isLoggedIn) {
    const userRole = await UserModel.getUserRoleByToken(req.cookies.token);
    const user = await UserModel.getUserByToken(req.cookies.token);

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
      title: "Blog",
      post: post.at(0),
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isEditor: isEditor,
      id: user.id,
      comments: await CommentModel.getAllCommentsForPostSlug(slug),
    };
  } else {
    res.locals = {
      title: "Blog",
      post: post.at(0),
      isLoggedIn: isLoggedIn,
      isAdmin: false,
      isEditor: false,
      id: -1,
      comments: await CommentModel.getAllCommentsForPostSlug(slug),
    };
  }
  res.render("post");
}

// post comment at a specific post by slug
// POST route for posting a comment on a specific post by slug
async function postCommentAtSlug(req, res) {
  const { slug } = req.params;
  const { content } = req.body;

  try {
    // console.log(slug);
    // const post =
    await CommentModel.createCommentForPostSlug(
      slug,
      content,
      req.cookies.token
    );

    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
// post creation page with ejs
async function createPost(req, res, next) {
  const userRole = await UserModel.getUserRoleByToken(req.cookies.token);
  const categories = await CategoryModel.getAll();

  // console.log(categories);

  let isAdmin, isEditor;
  const user = await UserModel.getUserByToken(req.cookies.token);

  if (!userRole) {
    return res.redirect("/auth/login");
  }
  if (userRole === "default") {
    return res.redirect("/");
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
    title: "Create Post",
    isLoggedIn: !!req.cookies.token,
    isAdmin: isAdmin,
    isEditor: isEditor,
    id: user.id,
    categories: categories,
  };
  res.render("create-post");
}

// post to postmodel with
async function createNewPost(req, res) {
  const post = req.body;
  const user = await UserModel.getUserByToken(req.cookies.token);
  const result = await PostModel.createPost(post, user);
  // console.log(result);
  res.redirect("/");
}

async function postLikeAtSlug(req, res, next) {
  const { slug } = req.params;
  console.log(slug);

  const user = await UserModel.getUserByToken(req.cookies.token);
  const result = await PostModel.likePost(slug, user.id);
  // console.log(result);
  res.redirect("back");
}

//search post by params
// Search post by query
async function searchPost(req, res, next) {
  console.log("User searched for:");
  const searchTerms = req.query.search;

  console.log(searchTerms);

  const posts = await PostModel.findAllPosts(searchTerms);

  // a user is logged in if there is token in the cookies
  let isAdmin, isEditor;
  const isLoggedIn = !!req.cookies.token;
  if (isLoggedIn) {
    const userRole = await UserModel.getUserRoleByToken(req.cookies.token);
    const user = await UserModel.getUserByToken(req.cookies.token);

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
      title: "Blog",
      posts: posts,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isEditor: isEditor,
      id: user.id,
    };
  } else {
    isAdmin = false;
    isEditor = false;
    res.locals = {
      title: "Blog",
      posts: posts,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isEditor: isEditor,
      id: -1,
    };
  }

  res.render("index");
}

async function adminDashboard(req, res, next) {
  // load admin dashboard
  const user = await UserModel.getUserByToken(req.cookies.token);
  const posts = await PostModel.getAllPosts();

  res.locals = {
    title: "Admin Dashboard",
    posts: posts,
    id: user.id,
  };

  res.render("admin-dashboard");
}

async function deletePost(req, res, next) {
  const { slug } = req.params;
  await PostModel.deletePost(slug);
  res.redirect("back");
}

export default {
  landingPage,
  postBySlug,
  postCommentAtSlug,
  createPost,
  createNewPost,
  postLikeAtSlug,
  searchPost,
  adminDashboard,
  deletePost,
};
