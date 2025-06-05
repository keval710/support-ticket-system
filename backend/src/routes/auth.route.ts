import express from "express";
import { authController } from "../controller";
import validate from "../middleware/validate";
import authValidation from "../validation/auth.validation";
import auth from "../middleware/auth";

const router = express.Router();

// OAuth login
router.post('/google', validate(authValidation.userSchema), authController.oAuthLogin);

// Logout
router.post('/logout', auth(), validate(authValidation.logoutSchema), authController.logout);

export default router;
