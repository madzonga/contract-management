import { Router } from 'express';
import { getBestProfession, getBestClients } from '../controllers/adminController';
import { validateQueryParams } from '../middleware/validateRequest';
import { getBestProfessionSchema, getBestClientsSchema } from '../validation/validation';

const router = Router();

router.get('/admin/best-profession', validateQueryParams(getBestProfessionSchema), getBestProfession);
router.get('/admin/best-clients', validateQueryParams(getBestClientsSchema), getBestClients);

export default router;