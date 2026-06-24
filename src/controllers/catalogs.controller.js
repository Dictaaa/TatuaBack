/**
 * makeController(Model, label)
 * Returns a controller object with list / getOne / create / update / remove
 * for any simple catalog table (tattoo_styles, body_zones, etc.)
 */
exports.makeController = (Model, label) => ({

  // GET /catalog
  list: async (req, res) => {
    try {
      const rows = await Model.findAll({
        where: { is_active: true },
        order: [['name', 'ASC']],
      });
      res.json(rows);
    } catch (error) {
      console.error(`Error listing ${label}:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // GET /catalog/:id
  getOne: async (req, res) => {
    try {
      const row = await Model.findByPk(req.params.id);
      if (!row) return res.status(404).json({ error: `${label} not found` });
      res.json(row);
    } catch (error) {
      console.error(`Error getting ${label}:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // POST /catalog
  create: async (req, res) => {
    try {
      const row = await Model.create(req.body);
      res.status(201).json(row);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: `${label} already exists` });
      }
      console.error(`Error creating ${label}:`, error);
      res.status(400).json({ error: 'Invalid data' });
    }
  },

  // PUT /catalog/:id
  update: async (req, res) => {
    try {
      const [rows] = await Model.update(req.body, {
        where: { id: req.params.id },
      });
      if (!rows) return res.status(404).json({ error: `${label} not found` });
      const updated = await Model.findByPk(req.params.id);
      res.json(updated);
    } catch (error) {
      console.error(`Error updating ${label}:`, error);
      res.status(400).json({ error: 'Invalid data' });
    }
  },

  // DELETE /catalog/:id  (soft delete — sets is_active = false)
  remove: async (req, res) => {
    try {
      const [rows] = await Model.update(
        { is_active: false },
        { where: { id: req.params.id } },
      );
      if (!rows) return res.status(404).json({ error: `${label} not found` });
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting ${label}:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  },
});