import { Router } from 'express';
import { getUnpaidJobs, payJob } from '../controllers/jobsController';
import { getProfile } from '../middleware/getProfile';
import { payJobSchema } from '../validation/validation';
import { validateRequestParams } from '../middleware/validateRequest';

const router = Router();

router.get('/jobs/unpaid', getProfile, getUnpaidJobs);
router.post('/jobs/:job_id/pay', getProfile, validateRequestParams(payJobSchema), payJob);

export default router;