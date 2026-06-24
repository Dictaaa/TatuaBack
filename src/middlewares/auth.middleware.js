const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_env';

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // 1. No header at all
    if (!header) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // 2. Header exists but token part is missing / "null" / "undefined"
    const parts = header.split(' ');
    const token = parts[1];

    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // 3. Verify
    const payload = jwt.verify(token, JWT_SECRET);
    req.artist_id = payload.id;
    req.artist    = payload;
    next();

  } catch (err) {
    // Only log unexpected errors, not normal expired/malformed tokens
    if (err.name !== 'JsonWebTokenError' && err.name !== 'TokenExpiredError') {
      console.error('Auth middleware error:', err);
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }

    return res.status(401).json({ error: 'Token inválido' });
  }
};