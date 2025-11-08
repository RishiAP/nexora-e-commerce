import dotenv from 'dotenv';
dotenv.config();

import app from '@/app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
