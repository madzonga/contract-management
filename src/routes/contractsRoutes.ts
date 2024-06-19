import { Router } from 'express';
import { getContractById, getContracts } from '../controllers/contractsController';
import { getProfile } from '../middleware/getProfile';
import { validateRequestParams } from '../middleware/validateRequest';
import { getContractByIdSchema } from '../validation/validation';

const router = Router();

router.get('/contracts', getProfile, getContracts);
router.get('/contracts/:id', getProfile, validateRequestParams(getContractByIdSchema), getContractById);

export default router;