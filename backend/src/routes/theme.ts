import { Router } from 'express';
import { getTheme, setTheme } from '@/controllers/setThemeController';

const router = Router();

// GET /api/theme - Get current theme from cookies
router.get('/', getTheme);

// POST /api/theme - Set theme in cookies
// Body: { theme: 'light' | 'dark' }
router.post('/', setTheme);

export default router;
