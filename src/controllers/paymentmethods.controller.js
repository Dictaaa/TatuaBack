const { Op } = require('sequelize');
const { PaymentMethod } = require('../models');

// GET /payment-methods?artist_id=1
// Returns: artist's own methods first, then global platform methods as fallback
exports.list = async (req, res) => {
  try {
    const { artist_id } = req.query;

    let methods;

    if (artist_id) {
      // Return artist's own methods OR global methods (artist_id IS NULL)
      methods = await PaymentMethod.findAll({
        where: {
          is_active: true,
          [Op.or]: [
            { artist_id: +artist_id },
            { artist_id: null },
          ],
        },
        order: [
          // Artist-specific methods first
          ['artist_id', 'DESC NULLS LAST'],
          ['id', 'ASC'],
        ],
      });
    } else {
      // No artist_id — return only global methods
      methods = await PaymentMethod.findAll({
        where: { is_active: true, artist_id: null },
        order: [['id', 'ASC']],
      });
    }

    res.json(methods);
  } catch (error) {
    console.error('Error listing payment methods:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /payment-methods/:id
exports.getOne = async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (!method) return res.status(404).json({ error: 'Payment method not found' });
    res.json(method);
  } catch (error) {
    console.error('Error getting payment method:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /payment-methods  (artist creates their own method)
exports.create = async (req, res) => {
  try {
    const method = await PaymentMethod.create({
      artist_id: req.artist_id,         // from auth middleware
      name:      req.body.name,
      detail:    req.body.detail || null,
      is_active: true,
    });
    res.status(201).json(method);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT /payment-methods/:id
exports.update = async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (!method) return res.status(404).json({ error: 'Payment method not found' });

    // Only the owner artist can update (global methods have artist_id = null)
    if (method.artist_id !== req.artist_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await method.update({
      name:      req.body.name   ?? method.name,
      detail:    req.body.detail ?? method.detail,
      is_active: req.body.is_active ?? method.is_active,
    });

    res.json(method);
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /payment-methods/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (!method) return res.status(404).json({ error: 'Payment method not found' });

    if (method.artist_id !== req.artist_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await method.update({ is_active: false });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Server error' });
  }
};