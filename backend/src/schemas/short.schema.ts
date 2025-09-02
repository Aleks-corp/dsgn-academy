import Joi from "joi";

const shortAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": `'title' cannot be an empty field`,
    "any.required": `missing required 'title' field`,
  }),
  description: Joi.string().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  // category: Joi.array().items(Joi.string()).required().messages({
  //   "string.empty": `'category' cannot be an empty field`,
  //   "any.required": `missing required 'category' field`,
  // }),
  tags: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'filter' cannot be an empty field`,
    "any.required": `missing required 'filter' field`,
  }),
  video: Joi.string().required().messages({
    "string.empty": `'video' cannot be an empty field`,
    "any.required": `missing required 'video' field`,
  }),
  originalVideo: Joi.string().messages({
    "string.empty": `'originalVideo' cannot be an empty field`,
  }),
  cover: Joi.string().required().messages({
    "string.empty": `'cover' cannot be an empty field`,
    "any.required": `missing required 'cover' field`,
  }),
  duration: Joi.string().required().messages({
    "string.empty": `'duration' cannot be an empty field`,
    "any.required": `missing required 'duration' field`,
  }),
  free: Joi.boolean().required().messages({
    "boolean.required": `'free' must be true or false`,
    "any.required": `missing required 'free' field`,
  }),
  publishedAt: Joi.string(),
});

const shortUpdateSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": `'title' cannot be an empty field`,
    "any.required": `missing required 'title' field`,
  }),
  description: Joi.string().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  // category: Joi.array().items(Joi.string()).required().messages({
  //   "string.empty": `'category' cannot be an empty field`,
  //   "any.required": `missing required 'category' field`,
  // }),
  tags: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'filter' cannot be an empty field`,
    "any.required": `missing required 'filter' field`,
  }),
  video: Joi.string().required().messages({
    "string.empty": `'video' cannot be an empty field`,
    "any.required": `missing required 'video' field`,
  }),
  originalVideo: Joi.string().messages({
    "string.empty": `'originalVideo' cannot be an empty field`,
  }),
  cover: Joi.string().required().messages({
    "string.empty": `'cover' cannot be an empty field`,
    "any.required": `missing required 'cover' field`,
  }),
  duration: Joi.string().required().messages({
    "string.empty": `'duration' cannot be an empty field`,
    "any.required": `missing required 'duration' field`,
  }),
  free: Joi.boolean().required().messages({
    "boolean.required": `'free' must be true or false`,
    "any.required": `missing required 'free' field`,
  }),
  publishedAt: Joi.string(),
});

export default { shortAddSchema, shortUpdateSchema };
