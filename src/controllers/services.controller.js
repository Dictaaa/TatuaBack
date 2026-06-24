const { Service } = require('../models');

// GET /services?artist_id=  or  GET /artists/:artist_id/services
exports.list = async (req, res) => {
  try {
    const artist_id = req.params.artist_id || req.query.artist_id;
    if (!artist_id) return res.status(400).json({ error: 'artist_id is required' });

    const services = await Service.findAll({
      where: { artist_id, is_active: true },
      order: [['sort_order', 'ASC'], ['id', 'ASC']],
    });

    res.json(services);
  } catch (error) {
    console.error('Error listing services:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /services/:id
exports.getOne = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /services
exports.create = async (req, res) => {
  try {
    // Ensure artist can only create their own services
    const artist_id = req.body.artist_id || req.artist_id;

    const service = await Service.create({
      artist_id,
      name:          req.body.name,
      description:   req.body.description   || null,
      price_from:    req.body.is_quote_only ? null : (req.body.price_from || null),
      is_quote_only: req.body.is_quote_only || false,
      badge:         req.body.badge         || 'Desde',
      sort_order:    req.body.sort_order    || 0,
      is_active:     true,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT /services/:id
exports.update = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    // Only the owner artist can update
    if (service.artist_id !== req.artist_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await service.update({
      name:          req.body.name          ?? service.name,
      description:   req.body.description   ?? service.description,
      price_from:    req.body.is_quote_only ? null : (req.body.price_from ?? service.price_from),
      is_quote_only: req.body.is_quote_only ?? service.is_quote_only,
      badge:         req.body.badge         ?? service.badge,
      sort_order:    req.body.sort_order    ?? service.sort_order,
      is_active:     req.body.is_active     ?? service.is_active,
    });

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /services/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    if (service.artist_id !== req.artist_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await service.update({ is_active: false });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Server error' });
  }
};