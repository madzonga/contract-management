import { Request, Response } from 'express';
import { Job } from '../models/job';
import { Op } from 'sequelize';
import { CustomRequest } from '../types/custom';
import { Profile, sequelize } from '../models/index';
import { payJobSchema } from '../validation/validation';
import { withRetry } from '../database/utils';

export const getUnpaidJobs = async (req: CustomRequest, res: Response) => {
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
  
  try {
    await withRetry(async (trx) => {
      const job = await Job.findOne({
        where: { id: job_id },
        include: [{ model: Contract }],
        transaction: trx,
        lock: trx.LOCK.UPDATE // Ensure the row is locked for update to prevent race conditions
      });

      if (!job) return res.status(404).end();
      if (job.paid) return res.status(400).json({ message: 'Job is already paid' });

      const client = await Profile.findOne({ where: { id: job.Contract.ClientId }, transaction: trx, lock: trx.LOCK.UPDATE });
      const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId }, transaction: trx, lock: trx.LOCK.UPDATE });

      if (client.balance < job.price) return res.status(400).json({ message: 'Insufficient balance' });

      client.balance -= job.price;
      contractor.balance += job.price;

      await Promise.all([
        client.save({ transaction: trx }),
        contractor.save({ transaction: trx }),
        job.update({ paid: true, paymentDate: new Date() }, { transaction: trx })
      ]);

      res.json(job);
    });
  } catch (error) {
    console.error('Error paying job:', error);
    res.status(500).json({ message: 'Error paying job', error: (error as Error).message });
  }
};