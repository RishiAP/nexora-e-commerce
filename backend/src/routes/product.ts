import { getProducts } from '@/controllers/productsController';
import { Router } from 'express';

const router = Router();

router.get('/', getProducts);

export default router;