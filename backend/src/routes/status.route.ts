import express from 'express';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import statusValidation from '../validation/status.validation';
import { statusController } from '../controller';

const router = express.Router();

// Status Routes
router
    .route('/')
    .post(auth(), validate(statusValidation.createStatus), statusController.createStatus)
    .get(auth(), statusController.getAllStatuses);

export default router;
