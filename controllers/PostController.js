import { __dirname } from "../app.js";
import PostModel from "../models/PostModel.js";
import CommentModel from "../models/CommentModel.js";

async function landingPage(_req, res, _next) {
  const posts = await PostModel.getAllPosts();
  res.locals = {
    title: "Blog",
    posts: posts,
  };
  res.render("index");
}

async function getPostBySlug(req, res, _next) {
  const { slug } = req.params;
  console.log(slug);
  const post = await PostModel.getPostBySlug(slug);
  res.locals = {
    title: "Blog",
    post: post.at(0),
    comments: await CommentModel.getAllCommentsForPostSlug(slug),
  };
  res.render("post");
}

export default {
  landingPage,
  getPostBySlug,
};
