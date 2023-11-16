import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

router.get("/",authController.welcome);
router.post("/pre-register", authController.preRegister);
router.post("/register", authController.register);

export default router;