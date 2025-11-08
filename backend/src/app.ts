import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cartRouter from '@/routes/cart';
import productRouter from '@/routes/product';
import checkoutRouter from '@/routes/checkout';
import themeRouter from '@/routes/theme';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// API logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log response time
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.end = function(this: any, ...args: any[]): any {
    const responseTime = Date.now() - startTime;
    console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`);
    
    // Call original end
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (originalEnd as any).apply(this, args);
  };
  
  next();
});

app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/theme', themeRouter);

export default app;
