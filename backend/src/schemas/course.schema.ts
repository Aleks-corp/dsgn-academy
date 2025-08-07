import Joi from "joi";

const courseAddSchema = Joi.object({
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
  videos: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required().messages({
          "string.empty": `'url' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
          "string.uri": `'url' must be a valid URI`,
        }),
        description: Joi.string().required().messages({
          "string.empty": `'description' cannot be an empty field`,
          "any.required": `missing required 'description' field`,
        }),
        cover: Joi.string().messages({
          "string.empty": `'cover' cannot be an empty field`,
          "any.required": `missing required 'cover' field`,
        }),
      })
    )
    .required()
    .messages({
      "array.base": `'videos' must be an array`,
      "array.includesRequiredUnknowns": `each video must have 'url' and 'description'`,
      "any.required": `missing required 'videos' field`,
    }),
  author: Joi.string(),
  level: Joi.string(),
  publishedAt: Joi.string(),
});

const courseUpdateSchema = Joi.object({
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
  videos: Joi.array().items(Joi.string()).messages({
    "string.empty": `'videos' cannot be an empty field`,
    "any.required": `missing required 'videos' field`,
  }),
  covers: Joi.array().items(Joi.string()),
  author: Joi.string(),
  level: Joi.string(),
  publishedAt: Joi.string(),
});

export default { courseAddSchema, courseUpdateSchema };
