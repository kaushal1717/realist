import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

router.get("/",authController.welcome);
router.post("/pre-register", authController.preRegister);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/access-account", authController.accessAccount);

export default router;