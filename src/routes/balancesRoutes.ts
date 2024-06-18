import { Router } from 'express';
import { depositBalance } from '../controllers/balancesController';

const router = Router();

router.post('/balances/deposit/:userId', depositBalance);

export default router;