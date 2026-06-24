const {
  Artist, City, Plan, Studio,
  TattooStyle, Service, Portfolio, ArtistConfig,
} = require('../models');

// ── Attributes to return on list (no password, no heavy fields) ──
const LIST_ATTRS = [
  'id','slug','name','handle','city_id','plan_id',
  'hero_image_url','rating_avg','total_reviews',
  'total_tattoos','is_available','is_active',
];

// GET /artists  — card list for landing page
exports.list = async (req, res) => {
  try {
    const where = { is_active: true };
    if (req.query.is_available !== undefined) {
      where.is_available = req.query.is_available === 'true';
    }
    if (req.query.city_id) where.city_id = req.query.city_id;

    const artists = await Artist.findAll({
      where,
      attributes: LIST_ATTRS,
      include: [
        { model: City,        as: 'city',   attributes: ['id','name'] },
        { model: TattooStyle, as: 'styles', attributes: ['id','name'],
          through: { attributes: [] } },  // hide junction table fields
      ],
      order: [['rating_avg', 'DESC']],
    });

    res.json(artists);
  } catch (error) {
    console.error('Error listing artists:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /artists/slug/:slug  — full public profile
exports.getBySlug = async (req, res) => {
  try {
    const artist = await Artist.findOne({
      where: { slug: req.params.slug, is_active: true },
      attributes: { exclude: ['password'] },
      include: [
        { model: City,        as: 'city'    },
        { model: Plan,        as: 'plan'    },
        { model: Studio,      as: 'studio'  },
        { model: TattooStyle, as: 'styles',
          through: { attributes: [] } },
        { model: ArtistConfig,as: 'config'  },
        {
          model: Service,
          as: 'services',
          where: { is_active: true },
          required: false,
          order: [['sort_order', 'ASC']],
        },
        {
          model: Portfolio,
          as: 'portfolio',
          where: { is_active: true },
          required: false,
          order: [['sort_order', 'ASC']],
        },
      ],
    });

    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (error) {
    console.error('Error getting artist by slug:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /artists/:id
exports.getOne = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: City,        as: 'city'   },
        { model: Plan,        as: 'plan'   },
        { model: TattooStyle, as: 'styles', through: { attributes: [] } },
        { model: ArtistConfig,as: 'config' },
      ],
    });
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (error) {
    console.error('Error getting artist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /artists
exports.create = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    await ArtistConfig.create({ artist_id: artist.id });
    res.status(201).json(artist);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Slug already taken' });
    }
    console.error('Error creating artist:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT /artists/:id
exports.update = async (req, res) => {
  try {
    const [rows] = await Artist.update(req.body, {
      where: { id: req.params.id },
    });
    if (!rows) return res.status(404).json({ error: 'Artist not found' });
    const updated = await Artist.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /artists/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const [rows] = await Artist.update(
      { is_active: false },
      { where: { id: req.params.id } },
    );
    if (!rows) return res.status(404).json({ error: 'Artist not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ error: 'Server error' });
  }
};