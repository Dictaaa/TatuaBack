const { Portfolio, TattooStyle } = require('../models');

// GET /artists/:artist_id/portfolio
exports.list = async (req, res) => {
  try {
    const artist_id = req.params.artist_id || req.query.artist_id;
    if (!artist_id) return res.status(400).json({ error: 'artist_id is required' });

    const portfolio = await Portfolio.findAll({
      where: { artist_id, is_active: true },
      include: [
        { model: TattooStyle, as: 'style', attributes: ['id', 'name'] },
      ],
      order: [['sort_order', 'ASC'], ['id', 'ASC']],
    });

    res.json(portfolio);
  } catch (error) {
    console.error('Error listing portfolio:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /portfolio/:id
exports.getOne = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id, {
      include: [{ model: TattooStyle, as: 'style', attributes: ['id', 'name'] }],
    });
    if (!item) return res.status(404).json({ error: 'Portfolio item not found' });
    res.json(item);
  } catch (error) {
    console.error('Error getting portfolio item:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /portfolio/:id  (update title, duration, sort_order — NOT image)
exports.update = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Portfolio item not found' });

    if (item.artist_id !== req.artist_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await item.update({
      title:          req.body.title          ?? item.title,
      style_id:       req.body.style_id       ?? item.style_id,
      duration_hours: req.body.duration_hours ?? item.duration_hours,
      is_featured:    req.body.is_featured    ?? item.is_featured,
      sort_order:     req.body.sort_order     ?? item.sort_order,
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /portfolio/:id  (hard delete + file handled by upload controller)
exports.remove = async (req, res) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Portfolio item not found' });

    if (item.artist_id !== req.artist_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await item.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Server error' });
  }
};