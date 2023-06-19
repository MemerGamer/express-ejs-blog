import express from "express";
import PostController from "../controllers/PostController.js";

import checkJwt from "../middlewares/check-jwt.js";
import checkAuth from "../middlewares/check-auth.js";
import checkAdmin from "../middlewares/check-admin.js";
const router = express.Router();

/* GET home page. */
router.get("/", PostController.landingPage);

// admin dashboard
router.get(
  "/dashboard",
  checkJwt,
  checkAuth,
  checkAdmin,
  PostController.adminDashboard
);

// Create
router.get("/create", checkJwt, checkAuth, PostController.createPost);
router.post("/create/post", checkJwt, checkAuth, PostController.createNewPost);

// Get post by search term
router.get("/search", PostController.searchPost);

// GET post by slug
router.get("/post/:slug", PostController.postBySlug);

// POST comment at a specific post by slug
router.post("/post/:slug/comment", PostController.postCommentAtSlug);

// DELETE post by slug
router.get(
  "/post/:slug/delete",
  checkJwt,
  checkAuth,
  checkAdmin,
  PostController.deletePost
);

// EDIT post by slug
router.get(
  "/post/:slug/edit",
  checkJwt,
  checkAuth,
  checkAdmin,
  PostController.editPost
);

router.post(
  "/post/:slug/edit",
  checkAuth,
  checkJwt,
  checkAdmin,
  PostController.saveEditedPost
);

// POST like at a specific post by slug
router.post("/post/:slug/like", PostController.postLikeAtSlug);
export default router;
