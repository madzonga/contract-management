import { Request, Response } from 'express';
import { Job } from '../models/job';
import { Profile } from '../models/profile';
import { Op } from 'sequelize';
import { sequelize } from '../models/index';

export const getBestProfession = async (req: Request, res: Response) => {
    const { start, end } = req.query as { start: string; end: string };
  
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    const bestProfession: Job[] = await Job.findAll({
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        model: Profile,
        as: 'Contractor',
        attributes: []
      }],
      attributes: [
        [sequelize.col('Contractor.profession'), 'profession'],
        [sequelize.fn('sum', sequelize.col('price')), 'total_earned']
      ],
      group: ['Contractor.profession'],
      order: [[sequelize.literal('total_earned'), 'DESC']],
      limit: 1
    });
  
    res.json(bestProfession[0] || {});
  };

export const getBestClients = async (req: Request, res: Response) => {
    const { start, end, limit = 2 } = req.query as { start: string; end: string; limit: string };

  const startDate = new Date(start);
  const endDate = new Date(end);

  const bestClients: Job[] = await Job.findAll({
    where: {
      paid: true,
      paymentDate: { [Op.between]: [startDate, endDate] }
    },
    include: [{
      model: Profile,
      as: 'Client'
    }],
    attributes: [
      'Client.id',
      'Client.firstName',
      'Client.lastName',
      [sequelize.fn('sum', sequelize.col('price')), 'total_paid']
    ],
    group: ['Client.id'],
    order: [[sequelize.literal('total_paid'), 'DESC']],
    limit: Number(limit)
  });

  res.json(bestClients);
};