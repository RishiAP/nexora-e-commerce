import { checkout } from '@/controllers/checkoutController';
import { Router } from 'express';

const router = Router();

router.post('/', checkout);

export default router;