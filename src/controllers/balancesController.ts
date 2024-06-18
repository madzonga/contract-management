import { Request, Response } from 'express';
import { Profile } from '../models/profile';
import { Job } from '../models/job';
import { Contract } from '../models/contract';
import { Op } from 'sequelize';
import { sequelize } from '../models/index';

export const depositBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    await sequelize.transaction(async (trx) => {
      const profile = await Profile.findOne({ where: { id: userId }, transaction: trx });

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
        ],
        transaction: trx
      });

      const totalToPay = jobsToPay.reduce((sum, job) => sum + job.price, 0);

      if (amount > totalToPay * 0.25) return res.status(400).json({ message: 'Deposit exceeds 25% of total jobs to pay' });

      profile.balance += amount;
      await profile.save({ transaction: trx });

      res.json(profile);
    });
  } catch (error) {
    console.error('Error depositing balance:', error);
    res.status(500).json({ message: 'Error depositing balance', error: (error as Error).message });
  }
};