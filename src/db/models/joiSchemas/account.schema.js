import Joi from "joi";

export const baseAccountSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const loginSchema = baseAccountSchema.fork(['email'], (schema) => schema.optional());
export const updateUsernameSchema = baseAccountSchema.fork(['email', 'password'], (schema) => schema.optional());
export const updateEmailSchema = baseAccountSchema.fork(['username', 'password'], (schema) => schema.optional());