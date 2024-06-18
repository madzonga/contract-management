import { Router } from 'express';
import { getUnpaidJobs, payJob } from '../controllers/jobsController';
import { getProfile } from '../middleware/getProfile';

const router = Router();

router.get('/jobs/unpaid', getProfile, getUnpaidJobs);
router.post('/jobs/:job_id/pay', getProfile, payJob);

export default router;