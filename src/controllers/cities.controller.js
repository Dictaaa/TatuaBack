const { City } = require('../models');

// GET /cities
exports.list = async (req, res) => {
  try {
    const cities = await City.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });
    res.json(cities);
  } catch (error) {
    console.error('Error listing cities:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /city/:id
exports.getOne = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (error) {
    console.error('Error getting city:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /cities
exports.create = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(City);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'City number already registered' });
    }
    console.error('Error creating client:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT /cities/:id
exports.update = async (req, res) => {
  try {
    const [rows] = await City.update(req.body, {
      where: { id: req.params.id },
    });
    if (!rows) return res.status(404).json({ error: 'City not found' });
    const updated = await City.findByPk(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /cities/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const [rows] = await City.update(
      { is_active: false },
      { where: { id: req.params.id } },
    );
    if (!rows) return res.status(404).json({ error: 'City not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ error: 'Server error' });
  }
};