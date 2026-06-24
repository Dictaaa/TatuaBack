const { Payment, Booking, PaymentMethod } = require('../models');

const FULL_INCLUDE = [
  { model: Booking,       as: 'booking' },
  { model: PaymentMethod, as: 'method'  },
];

// GET /payments
exports.list = async (req, res) => {
  try {
    const where = {};
    if (req.query.booking_id) where.booking_id = req.query.booking_id;
    if (req.query.is_verified !== undefined) {
      where.is_verified = req.query.is_verified === 'true';
    }

    const payments = await Payment.findAll({
      where,
      include: FULL_INCLUDE,
      order: [['created_at', 'DESC']],
    });
    res.json(payments);
  } catch (error) {
    console.error('Error listing payments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /payments/:id
exports.getOne = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: FULL_INCLUDE,
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /payments  (client submits proof)
exports.create = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    // Auto-advance booking state to awaiting_payment when deposit is registered
    if (payment.kind === 'deposit') {
      await Booking.update(
        { state: 'awaiting_payment' },
        { where: { id: payment.booking_id, state: 'pending' } },
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// PUT /payments/:id
exports.update = async (req, res) => {
  try {
    const [rows] = await Payment.update(req.body, {
      where: { id: req.params.id },
    });
    if (!rows) return res.status(404).json({ error: 'Payment not found' });
    const updated = await Payment.findByPk(req.params.id, { include: FULL_INCLUDE });
    res.json(updated);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /payments/:id
exports.remove = async (req, res) => {
  try {
    const rows = await Payment.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'Payment not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /payments/:id/verify  (artist confirms payment → booking confirmed)
exports.verify = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.update({ is_verified: true, verified_at: new Date() });

    // Auto-confirm booking when deposit is verified
    if (payment.kind === 'deposit') {
      await Booking.update(
        { state: 'confirmed' },
        { where: { id: payment.booking_id, state: 'awaiting_payment' } },
      );
    }

    const updated = await Payment.findByPk(payment.id, { include: FULL_INCLUDE });
    res.json(updated);
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};