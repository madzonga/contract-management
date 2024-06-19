import { Router } from 'express';
import { depositBalance } from '../controllers/balancesController';
import { validateRequest } from '../middleware/validateRequest';
import { depositBalanceSchema } from '../validation/validation';

const router = Router();

router.post('/balances/deposit/:userId', validateRequest(depositBalanceSchema), depositBalance);

export default router;