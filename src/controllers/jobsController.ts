import { Request, Response } from 'express';
import { Job } from '../models/job';
import { Op } from 'sequelize';
import { CustomRequest } from '../types/custom';
import { sequelize } from '../models/index';

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
  const { job_id } = req.params;

  try {
    await sequelize.transaction(async (trx) => {
      const { Job, Profile, Contract } = req.app.get('models');

      // Find the job within the transaction
      const job = await Job.findOne({
        where: { id: job_id },
        include: [{ model: Contract }]
      });

      if (!job) return res.status(404).end();
      if (job.paid) return res.status(400).json({ message: 'Job is already paid' });

      // Find client and contractor profiles
      const client = await Profile.findOne({ where: { id: job.Contract.ClientId } }, { transaction: trx });
      const contractor = await Profile.findOne({ where: { id: job.Contract.ContractorId } }, { transaction: trx });

      if (!client || !contractor) {
        return res.status(404).json({ message: 'Client or contractor not found' });
      }

      if (client.balance < job.price) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Perform balance transactions
      client.balance -= job.price;
      contractor.balance += job.price;

      // Save updated balances
      await client.save({ transaction: trx });
      await contractor.save({ transaction: trx });

      // Mark job as paid and set payment date
      job.paid = true;
      job.paymentDate = new Date();
      await job.save({ transaction: trx });

      res.json(job);
    });
  } catch (error: any) {
    console.error('Error paying job:', error);
    res.status(500).json({ message: 'Error paying job', error: error.message });
  }
};