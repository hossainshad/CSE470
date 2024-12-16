import express from "express";
import { loginPage, loginUser } from "../controllers/loginController.js";
const router = express.Router();

router.get("/login",loginPage);
router.post("/login",loginUser);
export default router;
