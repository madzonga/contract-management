import { Request, Response } from 'express';
import { Job } from '../models/job';
import { Op } from 'sequelize';

export const getUnpaidJobs = async (req: Request, res: Response) => {
  const { Job, Contract } = req.app.get('models');
  const profileId = req.get('profile_id');
  const jobs = await Job.findAll({
    where: {
      paid: false,
      '$Contract.status$': { [Op.ne]: 'terminated' },
      [Op.or]: [{ '$Contract.ContractorId$': profileId }, { '$Contract.ClientId$': profileId }]
    },
    include: [{ model: Contract }]
  });
  res.json(jobs);
};

export const payJob = async (req: Request, res: Response) => {
  const { Job, Profile, Contract } = req.app.get('models');
  const { job_id } = req.params;
  const job = await Job.findOne({
    where: { id: job_id },
    include: [{ model: Contract }]
  });

  if (!job) return res.status(404).end();
  if (job.paid) return res.status(400).json({ message: 'Job is already paid' });

  const client = await Profile.findOne({ where: { id: job.Contract.ClientId } });
  const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId } });

  if (client.balance < job.price) return res.status(400).json({ message: 'Insufficient balance' });

  client.balance -= job.price;
  contractor.balance += job.price;

  await client.save();
  await contractor.save();

  job.paid = true;
  job.paymentDate = new Date();
  await job.save();

  res.json(job);
};