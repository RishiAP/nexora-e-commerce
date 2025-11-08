import { addToCart, getCart, removeItemFromCart } from '@/controllers/cartController';
import { Router } from 'express';

const router = Router();

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', removeItemFromCart);

export default router;
