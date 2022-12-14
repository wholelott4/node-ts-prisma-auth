import Joi from 'joi'

const postCreateSchema = Joi.object({
    title: Joi.string().min(6).max(255).required(),
    description: Joi.string().min(6).max(4096).required()
})

const postUpdateSchema = Joi.object({
    title: Joi.string().min(6).max(255),
    description: Joi.string().min(6).max(4096),
    published: Joi.boolean()
})

export { postCreateSchema, postUpdateSchema }