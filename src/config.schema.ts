import * as Joi from 'joi';

export const envConfigValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  PORT: Joi.number().default(3000).required(),
  DATABASE_PORT: Joi.number().default(5432).required(),
  DATABASE_TYPE: Joi.string().valid('postgres').default('postgres').required(),
});
