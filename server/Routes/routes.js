import express from 'express';
import * as authController from '../controllers/AuthController.js';
import { requireSignIn } from '../middleware/Verification.js';

const router = express.Router();

router.get("/",requireSignIn,authController.welcome);
router.post("/pre-register", authController.preRegister);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/access-account", authController.accessAccount);
router.get("/refresh-token", authController.refreshToken);
router.get("/current-user", requireSignIn, authController.currentUser);
router.get("/profile/:username", authController.publicProfile);
router.put("/update-password", requireSignIn, authController.updatePassword);
router.put("/update-profile", requireSignIn, authController.updateProfile);

export default router;