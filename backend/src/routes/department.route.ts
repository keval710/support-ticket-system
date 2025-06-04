import express from 'express';
import auth from '../middleware/auth';
import { departmentController } from '../controller';

const router = express.Router();

router.route('/')
    .post(auth(), departmentController.createDepartment)
    .get(auth(), departmentController.getDepartments);

export default router;
