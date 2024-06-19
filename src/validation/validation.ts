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

export const getBestProfessionSchema = Joi.object({
  start: Joi.date().required().label('Start Date'),
  end: Joi.date().required().label('End Date'),
});

export const getBestClientsSchema = Joi.object({
  start: Joi.date().required().label('Start Date'),
  end: Joi.date().required().label('End Date'),
  limit: Joi.number().integer().min(1).default(2).label('Limit'),
});