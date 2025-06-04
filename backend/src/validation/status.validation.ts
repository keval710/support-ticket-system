import Joi from 'joi';

const createOrUpdateStatus = {
    body: Joi.object({
        title: Joi.string().required(),
        color: Joi.string().required(),
        includeInActive: Joi.boolean().default(true),
        autoCloseAfterMinutes: Joi.number().min(1).optional(),
    }),
};

export default {
    createOrUpdateStatus,
};
