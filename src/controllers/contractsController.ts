import { Request, Response } from 'express';
import { Contract } from '../models/contract';
import { Op } from 'sequelize';

export const getContracts = async (req: Request, res: Response) => {
  const { Contract } = req.app.get('models');
  const profileId = req.get('profile_id');
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: { [Op.ne]: 'terminated' }
    }
  });
  res.json(contracts);
};

export const getContractById = async (req: Request, res: Response) => {
  const { Contract } = req.app.get('models');
  const profile = req.profile as Profile;
  const { id } = req.params;

  if (!profile) {
    return res.status(401).end();
  }

  const contract = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }]
    }
  });

  if (!contract) {
    return res.status(404).end();
  }

  res.json(contract);
};

