const jwt    = require('jsonwebtoken');
const { Artist } = require('../models');

const JWT_SECRET  = process.env.JWT_SECRET  || 'change_me_in_env';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { slug, password } = req.body;

    if (!slug || !password) {
      return res.status(400).json({ error: 'Slug y contraseña son requeridos' });
    }

    // Usar scope withPassword para incluir el campo password en la query
    const artist = await Artist.scope('withPassword').findOne({
      where: { slug, is_active: true },
    });

    if (!artist) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const valid = await artist.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: artist.id, slug: artist.slug },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES },
    );

    res.json({
      token,
      artist: {
        id:     artist.id,
        name:   artist.name,
        slug:   artist.slug,
        handle: artist.handle,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { name, slug, handle, city_id, whatsapp, email, password } = req.body;

    if (!name || !slug || !password) {
      return res.status(400).json({ error: 'Nombre, slug y contraseña son requeridos' });
    }

    const existing = await Artist.findOne({ where: { slug } });
    if (existing) {
      return res.status(409).json({ error: 'Ese slug ya está en uso' });
    }

    // password es hasheado automáticamente por el hook beforeCreate del modelo
    const artist = await Artist.create({
      name,
      slug,
      handle: handle || `@${slug}`,
      city_id: city_id || 1,
      whatsapp,
      email,
      password,
    });

    const token = jwt.sign(
      { id: artist.id, slug: artist.slug },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES },
    );

    res.status(201).json({
      token,
      artist: {
        id:     artist.id,
        name:   artist.name,
        slug:   artist.slug,
        handle: artist.handle,
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El slug o email ya existe' });
    }
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  // JWT es stateless — solo confirmamos en el servidor
  res.json({ message: 'Sesión cerrada correctamente' });
};

// GET /auth/me
exports.me = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.artist_id);
    if (!artist) return res.status(404).json({ error: 'Artista no encontrado' });
    res.json(artist);
  } catch (error) {
    console.error('Error in /me:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};