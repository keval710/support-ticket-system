import Joi from "joi";
import { Provider, Role } from "../types";

const userSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        picture: Joi.string().required(),
        providerId: Joi.string().required(),
        role: Joi.string().valid(Role.USER, Role.ADMIN).optional(),
        registrationType: Joi.string().valid(Provider.GOOGLE, Provider.LOCAL).required(),
        isEmailVerified: Joi.boolean().required()
    })
}

const logoutSchema = {
    body: Joi.object({
        userId: Joi.string().required()
    })
}

export default {
    userSchema,
    logoutSchema
}