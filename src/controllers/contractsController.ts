import { Request, Response } from 'express';
import { Contract } from '../models/contract';
import { Profile } from '../models/profile'; // Import Profile model if needed
import { Op } from 'sequelize';
import { CustomRequest } from '../types/custom';

export const getContracts = async (req: CustomRequest, res: Response) => {
  const { Contract } = req.app.get('models');
  const contracts: Contract[] = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: req.profile.id }, { ClientId: req.profile.id }],
      status: { [Op.ne]: 'terminated' }
    }
  });
  res.json(contracts);
};

export const getContractById = async (req: CustomRequest, res: Response) => {
  const { Contract } = req.app.get('models');
  
  const contract = await Contract.findOne({
    where: {
      id: req.params.id,
      [Op.or]: [{ ContractorId: req.profile.id }, { ClientId: req.profile.id }]
    }
  });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract);
};
