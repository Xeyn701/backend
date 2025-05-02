import express from "express";
import { 
    loginUser,
    refreshToken,
    registerUser,
    logoutUser } from "../controllers/AuthController.js";

const router = express.Router();
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.get("/refresh-token", refreshToken);

export default router;