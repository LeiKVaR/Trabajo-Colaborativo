import { Request, Response, NextFunction } from 'express';

export const authorize = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const allowedRoles = typeof roles === 'string' ? [roles] : roles;

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Forbidden: You do not have permission to access this resource. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};
