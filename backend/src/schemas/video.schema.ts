import Joi from "joi";

const videoAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": `'title' cannot be an empty field`,
    "any.required": `missing required 'title' field`,
  }),
  description: Joi.string().required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  category: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'category' cannot be an empty field`,
    "any.required": `missing required 'category' field`,
  }),
  video: Joi.string().required().messages({
    "string.empty": `'video' cannot be an empty field`,
    "any.required": `missing required 'video' field`,
  }),
  cover: Joi.string(),
  author: Joi.string(),
  level: Joi.string(),
  publishedAt: Joi.string(),
});

const videoUpdateSchema = Joi.object({
  title: Joi.string().messages({
    "string.empty": `'title' cannot be an empty field`,
    "any.required": `missing required 'title' field`,
  }),
  description: Joi.string().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  category: Joi.array().items(Joi.string()).messages({
    "string.empty": `'category' cannot be an empty field`,
    "any.required": `missing required 'category' field`,
  }),
  video: Joi.string().messages({
    "string.empty": `'video' cannot be an empty field`,
    "any.required": `missing required 'video' field`,
  }),
  cover: Joi.string(),
  author: Joi.string(),
  level: Joi.string(),
  publishedAt: Joi.string(),
});

export default { videoAddSchema, videoUpdateSchema };
