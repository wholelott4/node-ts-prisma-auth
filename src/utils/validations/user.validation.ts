import Joi from 'joi'

const userRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(4).max(120).required(),
    password: Joi.string().min(6).max(120).required()
})

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(120).required()
})

export { userRegisterSchema, userLoginSchema }