import Joi from 'joi';

export const payJobSchema = Joi.object({
  job_id: Joi.number().integer().required()
});

export const depositBalanceSchema = Joi.object({
  amount: Joi.number().positive().required()
});

export const getContractByIdSchema = Joi.object({
  id: Joi.number().integer().required()
});