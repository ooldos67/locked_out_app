import express from "express";
import {
  login,
  logout,
  signup,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// protectRoute is a function that needs to be validated to get to the getCurrentUser function
router.get("/me", protectRoute, getCurrentUser);

export default router;
