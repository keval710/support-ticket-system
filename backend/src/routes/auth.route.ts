import express from "express";
import { authController } from "../controller";
import validate from "../middleware/validate";
import authValidation from "../validation/authValidation";

const router = express.Router();

// OAuth login
router.post('/google', validate(authValidation.userSchema), authController.oAuthLogin);

export default router;
