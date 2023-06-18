import express from "express";
import PostController from "../controllers/PostController.js";
const router = express.Router();

/* GET home page. */
router.get("/", PostController.landingPage);

// GET post by slug
router.get("/post/:slug", PostController.postBySlug);

export default router;
