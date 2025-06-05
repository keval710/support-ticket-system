import Joi from "joi";

const departmentSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        email: Joi.string().email().optional(),
        assignedAdmins: Joi.array().items(Joi.string()).optional(),
        hidden: Joi.boolean().optional()
    })
}

export default {
    departmentSchema
}