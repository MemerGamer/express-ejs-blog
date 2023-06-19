import express from "express";
import UserController from "../controllers/UserController.js";
import checkJwt from "../middlewares/check-jwt.js";
import checkAuth from "../middlewares/check-auth.js";
const router = express.Router();

/* GET home page. */
router.use(checkAuth);
router.use(checkJwt);
router.get("/profile", UserController.displayProfile);

export default router;
