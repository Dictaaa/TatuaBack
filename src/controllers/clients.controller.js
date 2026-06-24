const { Client, Booking } = require('../models');

// GET /clients
exports.list = async (req, res) => {
  try {
    const clients = await Client.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });
    res.json(clients);
  } catch (error) {
    console.error('Error listing clients:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /clients/:id
exports.getOne = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{
        model: Booking,
        as: 'bookings',
        order: [['created_at', 'DESC']],
      }],
    });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /clients
exports.create = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'WhatsApp number already registered' });
    }
    console.error('Error creating client:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT /clients/:id
exports.update = async (req, res) => {
  try {
    const [rows] = await Client.update(req.body, {
      where: { id: req.params.id },
    });
    if (!rows) return res.status(404).json({ error: 'Client not found' });
    const updated = await Client.findByPk(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /clients/:id  (soft delete)
exports.remove = async (req, res) => {
  try {
    const [rows] = await Client.update(
      { is_active: false },
      { where: { id: req.params.id } },
    );
    if (!rows) return res.status(404).json({ error: 'Client not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Server error' });
  }
};