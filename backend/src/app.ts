import express from 'express';
import cors from 'cors';
import cartRouter from '@/routes/cart';
import productRouter from '@/routes/product';
import checkoutRouter from '@/routes/checkout';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/checkout', checkoutRouter);

export default app;
