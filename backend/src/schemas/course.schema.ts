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
        title: Joi.string().required().messages({
          "string.empty": `'description' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
        }),
        url: Joi.string().uri().required().messages({
          "string.empty": `'url' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
          "string.uri": `'url' must be a valid URI`,
        }),
        description: Joi.string().required().messages({
          "string.empty": `'description' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
        }),
        cover: Joi.string().required().messages({
          "string.empty": `'cover' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
        }),
        duration: Joi.string().required().messages({
          "string.empty": `'url' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
        }),
      })
    )
    .required()
    .messages({
      "array.base": `'videos' must be an array`,
      "array.includesRequiredUnknowns": `each video must have 'url' and 'description'`,
      "any.required": `missing required 'videos' field`,
    }),
  publishedAt: Joi.string(),
});

const courseUpdateSchema = Joi.object({
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
          "any.required": `missing required 'url' field`,
        }),
        cover: Joi.string().required().messages({
          "string.empty": `'cover' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
        }),
        duration: Joi.string().required().messages({
          "string.empty": `'url' cannot be an empty field`,
          "any.required": `missing required 'url' field`,
        }),
      })
    )
    .required()
    .messages({
      "array.base": `'videos' must be an array`,
      "array.includesRequiredUnknowns": `each video must have 'url' and 'description'`,
      "any.required": `missing required 'videos' field`,
    }),
  publishedAt: Joi.string(),
});

export default { courseAddSchema, courseUpdateSchema };
