import express from 'express';
import ticketValidation from '../validation/ticket.validation';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import escalationController from '../controller/escalation.controller';

const router = express.Router();

// Escalation Rule Routes
router
    .route('/escalation-rules')
    .post(auth(), validate(ticketValidation.escalationRuleSchema), escalationController.createEscalationRule)
    .get(auth(), escalationController.getEscalationRules);

router
    .route('/escalation-rules/:id')
    .put(auth(), validate(ticketValidation.escalationRuleSchema), escalationController.updateEscalationRule)
    .delete(auth(), escalationController.deleteEscalationRule);

export default router;