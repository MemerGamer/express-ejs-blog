import express from "express";
import PostController from "../controllers/PostController.js";
const router = express.Router();

/* GET home page. */
router.get("/", PostController.landingPage);

// Create
router.get("/create", PostController.createPost);
router.post("/create/post", PostController.createNewPost);

// GET post by slug
router.get("/post/:slug", PostController.postBySlug);

// POST comment at a specific post by slug
router.post("/post/:slug/comment", PostController.postCommentAtSlug);

// POST like at a specific post by slug
router.post("/post/:slug/like", PostController.postLikeAtSlug);
export default router;
