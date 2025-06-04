import express from 'express';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import ticketValidation from '../validation/ticket.validation';
import { ticketController } from '../controller';

const router = express.Router();

// Ticket Routes
router
    .route('/')
    .post(auth(), validate(ticketValidation.ticketSchema), ticketController.createTicket)
    .get(auth(), validate(ticketValidation.getAllTicketsParamsSchema), ticketController.getAllTickets);

router
    .route('/:id')
    .get(auth(), ticketController.getTicket)
    .patch(auth(), validate(ticketValidation.updateTicketSchema), ticketController.updateTicket)

router
    .route('/assign/:id')
    .patch(auth(), validate(ticketValidation.assignTicketSchema), ticketController.assignTicket);

export default router;
