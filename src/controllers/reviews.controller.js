const { Review, Booking, Artist, Client } = require('../models');

// GET /reviews
exports.list = async (req, res) => {
  try {
    const where = { is_visible: true };
    if (req.query.artist_id) where.artist_id = req.query.artist_id;

    const reviews = await Review.findAll({
      where,
      include: [
        { model: Artist, as: 'artist', attributes: ['id', 'name', 'slug'] },
        { model: Client, as: 'client', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error listing reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /reviews
exports.create = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.body.booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.state !== 'completed') {
      return res.status(422).json({ error: 'Booking is not completed yet' });
    }

    const review = await Review.create({
      booking_id: booking.id,
      artist_id:  booking.artist_id,
      client_id:  booking.client_id,
      rating:     req.body.rating,
      body:       req.body.body || null,
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Review already submitted for this booking' });
    }
    console.error('Error creating review:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /reviews/:id  (soft hide — admin only)
exports.hide = async (req, res) => {
  try {
    const [rows] = await Review.update(
      { is_visible: false },
      { where: { id: req.params.id } },
    );
    if (!rows) return res.status(404).json({ error: 'Review not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error hiding review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};