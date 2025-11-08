import { Request, Response } from 'express';

/**
 * Get the current theme from cookies
 * GET /api/theme
 */
export const getTheme = (req: Request, res: Response): void => {
  try {
    // Read theme from cookies, default to 'light'
    const theme = req.cookies?.theme || 'light';
    
    res.status(200).json({
      theme,
      message: 'Theme retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting theme:', error);
    res.status(500).json({
      error: 'Failed to get theme',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Set the theme in cookies
 * POST /api/theme
 * Body: { theme: 'light' | 'dark' }
 */
export const setTheme = (req: Request, res: Response): void => {
  try {
    const { theme } = req.body;

    // Validate theme value
    if (!theme || !['light', 'dark'].includes(theme)) {
      res.status(400).json({
        error: 'Invalid theme',
        message: 'Theme must be either "light" or "dark"'
      });
      return;
    }

    // Set cookie with theme value
    // Cookie options:
    // - httpOnly: true (prevents client-side JS access for security)
    // - maxAge: 1 year in milliseconds
    // - sameSite: 'lax' (CSRF protection)
    // - secure: true in production (HTTPS only)
    res.cookie('theme', theme, {
      httpOnly: false, // Set to false so client JS can read it if needed
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    });

    res.status(200).json({
      theme,
      message: 'Theme set successfully'
    });
  } catch (error) {
    console.error('Error setting theme:', error);
    res.status(500).json({
      error: 'Failed to set theme',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
