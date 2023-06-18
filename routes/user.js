import express from "express";
import UserController from "../controllers/UserController.js";
const router = express.Router();

/* GET home page. */
router.get("/profile", UserController.displayProfile);

export default router;
