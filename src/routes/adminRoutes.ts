import { Router } from 'express';
import { getBestProfession, getBestClients } from '../controllers/adminController';

const router = Router();

router.get('/admin/best-profession', getBestProfession);
router.get('/admin/best-clients', getBestClients);

export default router;