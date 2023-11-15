import express from 'express';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

router.get("/",authController.welcome_back);

export default router;