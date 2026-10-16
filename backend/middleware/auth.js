import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'prephq_jwt_dev_secret_key_8f3d99e';

export const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Access denied. Bearer token missing.',
      error: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token.',
      error: 'Invalid token',
    });
  }
};

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: false,
      message: 'Access denied. Admin token missing.',
      error: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        status: false,
        message: 'Forbidden. Admin privileges required.',
        error: 'Forbidden',
      });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired admin token.',
      error: 'Invalid token',
    });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

export default { verifyUserToken, verifyAdminToken, optionalAuth };
