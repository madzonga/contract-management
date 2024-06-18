import { Request, Response } from 'express';
import { Profile } from '../models/profile';
import { Job } from '../models/job';
import { Contract } from '../models/contract';
import { Op } from 'sequelize';

export const depositBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;

  const profile = await Profile.findOne({ where: { id: userId } });

  if (!profile) return res.status(404).end();

  const jobsToPay = await Job.findAll({
    where: { paid: false },
    include: [
      {
        model: Contract,
        where: {
          ClientId: userId,
          status: { [Op.ne]: 'terminated' }
        }
      }
    ]
  });

  const totalToPay = jobsToPay.reduce((sum, job) => sum + job.price, 0);

  if (amount > totalToPay * 0.25) return res.status(400).json({ message: 'Deposit exceeds 25% of total jobs to pay' });

  profile.balance += amount;
  await profile.save();

  res.json(profile);
};