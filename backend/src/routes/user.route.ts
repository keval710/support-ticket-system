import express from "express";
import { userController } from "../controller";
import auth from "../middleware/auth";

const router = express.Router();

// Get all users
router
    .route('/')
    .get(auth(), userController.getUsers);

// Get user by id
router
    .route('/:id')
    .get(auth(), userController.getUserById);

export default router;
