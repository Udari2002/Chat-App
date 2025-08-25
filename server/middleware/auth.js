import jwt from 'jsonwebtoken';

const shouldDebug = (flag) =>
  String(process.env[flag] || '').toLowerCase() === 'true';

export const auth = (req, res, next) => {
  try {
    const header =
      req.headers.authorization ||
      req.headers.Authorization ||
      req.header('x-auth-token');

    let token = null;

    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      token = header.slice(7).trim();
    } else if (typeof header === 'string') {
      token = header.trim();
    }

    if (!token) {
      return res.status(401).json({ message: 'No auth token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id || decoded._id || decoded.userId;

    if (!id) {
      if (shouldDebug('DEBUG_AUTH')) console.error('Auth: missing id in token payload:', decoded);
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = { _id: id, ...decoded };

    if (shouldDebug('DEBUG_AUTH')) {
      console.log('Auth OK → userId:', id);
    }

    return next();
  } catch (err) {
    if (shouldDebug('DEBUG_AUTH')) console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
