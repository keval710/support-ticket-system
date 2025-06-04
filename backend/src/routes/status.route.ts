import express from 'express';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import statusValidation from '../validation/status.validation';
import { statusController } from '../controller';

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(statusValidation.createOrUpdateStatus), statusController.createStatus)
    .get(auth(), statusController.getAllStatuses);

router
    .route('/:id')
    .put(auth(), validate(statusValidation.createOrUpdateStatus), statusController.updateStatus)
    .delete(auth(), statusController.deleteStatus);

export default router;
