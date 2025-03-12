import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  loginUser,
  checkUsername,
  checkEmail,
  registerUser,
  logoutUser,
  result,
  profile,
  leaderboard,
  checkingRoute,
} from "../controllers/index";

const router = Router();

router.route("/hello").get(checkingRoute);

router.route("/check-username").get(checkUsername);
router.route("/check-email").get(checkEmail);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/leaderboard").get(leaderboard);

// secured routes
router.route("/profile/:username").get(verifyJWT, profile);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/result").post(verifyJWT, result);

export default router;
