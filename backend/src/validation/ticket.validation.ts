import Joi from "joi";
import { Priority } from "../types";

const ticketSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        priority: Joi.string().valid(Priority.LOW, Priority.HIGH, Priority.MEDIUM, Priority.URGENT).required(),
        departmentId: Joi.string().required().optional(),
        assignedTo: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        status: Joi.string().optional()
    })
}

const escalationRuleSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        conditions: Joi.object({
            department: Joi.string().optional(),
            status: Joi.string().optional(),
            priority: Joi.string().valid(Priority.LOW, Priority.HIGH, Priority.MEDIUM, Priority.URGENT).optional(),
            elapsedMinutes: Joi.number().min(1).optional()
        }).required(),
        actions: Joi.object({
            newDepartment: Joi.string().optional(),
            newStatus: Joi.string().optional(),
            newPriority: Joi.string().valid(Priority.LOW, Priority.HIGH, Priority.MEDIUM, Priority.URGENT).optional(),
            escalateToUser: Joi.string().optional(),
            replyMessage: Joi.string().optional()
        }).required(),
        logic: Joi.string().valid('AND', 'OR').default('AND')
    })
};

const getAllTicketsParamsSchema = {
    query: Joi.object({
        departmentId: Joi.string().optional(),
        status: Joi.string().optional(),
        priority: Joi.string().valid(Priority.LOW, Priority.HIGH, Priority.MEDIUM, Priority.URGENT).optional(),
        assignedTo: Joi.string().optional(),
        tags: Joi.array().items(Joi.string()).optional(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10)
    })
}

const assignTicketSchema = {
    params: Joi.object({
        id: Joi.string().required()
    }),
    body: Joi.object({
        assignedTo: Joi.string().required()
    })
}

const updateTicketStatusSchema = {
    params: Joi.object({
        id: Joi.string().required()
    }),
    body: Joi.object({
        statusId: Joi.string().required()
    }) 
}

export default {
    ticketSchema,
    getAllTicketsParamsSchema,
    escalationRuleSchema,
    assignTicketSchema,
    updateTicketStatusSchema
}