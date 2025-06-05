import express from 'express';
import auth from '../middleware/auth';
import { departmentController } from '../controller';
import validate from '../middleware/validate';
import departmentValidation from '../validation/department.validation';

const router = express.Router();

// Department Routes
router.route('/')
    .post(auth(), validate(departmentValidation.departmentSchema), departmentController.createDepartment)
    .get(auth(), departmentController.getDepartments);

export default router;
