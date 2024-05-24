import express from "express";
import { signup, signin, google, signout } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signout", signout);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

export default router;
