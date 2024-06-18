import { Router } from 'express';
import { getContractById, getContracts } from '../controllers/contractsController';
import { getProfile } from '../middleware/getProfile';

const router = Router();

router.get('/contracts', getProfile, getContracts);
router.get('/contracts/:id', getProfile, getContractById);

export default router;