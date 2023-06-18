import { __dirname } from "../app.js";
import PostModel from "../models/PostModel.js";
import CommentModel from "../models/CommentModel.js";

async function landingPage(_req, res, _next) {
  const posts = await PostModel.getAllPosts();
  // a user is logged in if there is token in the cookies
  const isLoggedIn = !!_req.cookies.token;
  // console.log(_req.session);

  res.locals = {
    title: "Blog",
    posts: posts,
    isLoggedIn: isLoggedIn,
  };
  res.render("index");
}

async function postBySlug(req, res, _next) {
  const { slug } = req.params;
  //console.log(slug);
  const post = await PostModel.getPostBySlug(slug);
  const isLoggedIn = !!req.cookies.token;
  res.locals = {
    title: "Blog",
    post: post.at(0),
    isLoggedIn: isLoggedIn,
    comments: await CommentModel.getAllCommentsForPostSlug(slug),
  };
  res.render("post");
}

export default {
  landingPage,
  postBySlug,
};
