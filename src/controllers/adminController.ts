import { Request, Response } from 'express';
import { Job, JobAttributes } from '../models/job';
import { Profile } from '../models/profile';
import { Op } from 'sequelize';
import { Contract, sequelize } from '../models/index';


export const getBestProfession = async (req: Request, res: Response) => {
  const { start, end } = req.query;

  try {
    const bestProfession = await Job.findAll({
      attributes: [
        'Contract.Contractor.profession',
        [sequelize.fn('sum', sequelize.col('price')), 'total_earned'],
      ],
      include: [{ model: Contract, as: 'Contract', include: [{ model: Profile, as: 'Contractor' }] }],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [new Date(start as string), new Date(end as string)],
        },
      },
      group: ['Contract.Contractor.profession'],
      order: [[sequelize.literal('total_earned'), 'DESC']],
      limit: 1,
    });

    if (!bestProfession || bestProfession.length === 0) {
      return res.status(404).json({ message: 'No profession found in the given date range' });
    }
    const result = {
      profession: bestProfession[0].Contract?.Contractor?.profession,
      totalEarned: parseFloat(bestProfession[0]?.getDataValue('total_earned' as keyof JobAttributes) as string ?? '0'),
    };
    res.json(result);
  } catch (error: any) {
    console.error('Error fetching best profession:', error);
    res.status(500).json({ message: 'Error fetching best profession', error: error.message });
  }
};

export const getBestClients = async (req: Request, res: Response) => {
  const { start, end, limit = 2 } = req.query;
  try {
    const bestClients = await Job.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.col('price')), 'total_paid'],
      ],
      include: [{ model: Contract, as: 'Contract', include: [{ model: Profile, as: 'Client' }] }],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [new Date(start as string), new Date(end as string)],
        },
      },
      group: ['Contract.Client.id', 'Contract.Client.firstName', 'Contract.Client.lastName'],
      order: [[sequelize.literal('total_paid'), 'DESC']],
      limit: parseInt(limit as string, 10) || 2, // Default limit 2
    });

    if (!bestClients || bestClients.length === 0) {
      return res.status(404).json({ message: 'No clients found in the given date range' });
    }

    const formattedClients = bestClients.map((job: any) => {
      const totalPaid = job.getDataValue('total_paid');
      return {
        id: job.Contract.Client.id,
        fullName: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
        paid: totalPaid,
      };
    });

    res.json(formattedClients);
  } catch (error) {
    console.error('Error fetching best clients:', error);
    res.status(500).json({ message: 'Error fetching best clients', error: (error as Error).message });
  }
};