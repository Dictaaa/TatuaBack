const {
  Booking, Client, Artist, ArtistConfig,
  TattooType, TattooStyle, BodyZone, TattooSize,
  BookingStateHistory, Payment, Reschedule,
} = require('../models');

const FULL_INCLUDE = [
  { model: Artist,      as: 'artist' },
  { model: Client,      as: 'client' },
  { model: TattooType,  as: 'type'   },
  { model: TattooStyle, as: 'style'  },
  { model: BodyZone,    as: 'zone'   },
  { model: TattooSize,  as: 'size'   },
  {
    model: Payment,
    as: 'payments',
    include: [{ association: 'method' }],
  },
];

// GET /bookings
exports.list = async (req, res) => {
  try {
    const where = {};
    if (req.query.artist_id) where.artist_id = req.query.artist_id;
    if (req.query.client_id) where.client_id = req.query.client_id;
    if (req.query.state)     where.state     = req.query.state;
    if (req.query.date)      where.booked_date = req.query.date;

    const bookings = await Booking.findAll({
      where,
      include: FULL_INCLUDE,
      order: [['booked_date', 'DESC'], ['created_at', 'DESC']],
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error listing bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /bookings/:id
exports.getOne = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: FULL_INCLUDE,
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /bookings  (public — client creates booking)
exports.create = async (req, res) => {
  try {
    const {
      client_name,
      client_whatsapp,
      client_email,
      artist_id,
      type_id,
      style_id,
      zone_id,
      size_id,
      description,
      reference_url,
      booked_date,
    } = req.body;

    // Upsert client by whatsapp
    const [client] = await Client.findOrCreate({
      where: { whatsapp: client_whatsapp },
      defaults: { name: client_name, email: client_email || null },
    });

    // Get artist deposit config
    const config = await ArtistConfig.findOne({ where: { artist_id } });
    const deposit_percent = config?.deposit_percent ?? 50;

    const booking = await Booking.create({
      artist_id,
      client_id:      client.id,
      type_id,
      style_id:       style_id      || null,
      zone_id:        zone_id       || null,
      size_id:        size_id       || null,
      description:    description   || null,
      reference_url:  reference_url || null,
      booked_date:    booked_date   || null,
      deposit_percent,
      state: 'pending',
    });

    const full = await Booking.findByPk(booking.id, { include: FULL_INCLUDE });
    res.status(201).json(full);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ error: 'Invalid data', detail: error.message });
  }
};

// PUT /bookings/:id
exports.update = async (req, res) => {
  try {
    const [rows] = await Booking.update(req.body, {
      where: { id: req.params.id },
    });
    if (!rows) return res.status(404).json({ error: 'Booking not found' });
    const updated = await Booking.findByPk(req.params.id, { include: FULL_INCLUDE });
    res.json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /bookings/:id  (cancel — sets state to cancelled)
exports.cancel = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    await booking.update({ state: 'cancelled' });
    res.status(204).end();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /bookings/:id/state
exports.changeState = async (req, res) => {
  try {
    const { state, note } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const prev_state = booking.state;
    await booking.update({ state });

    await BookingStateHistory.create({
      booking_id: booking.id,
      prev_state,
      new_state:  state,
      note:       note || null,
    });

    res.json({ id: booking.id, prev_state, state });
  } catch (error) {
    console.error('Error changing booking state:', error);
    res.status(400).json({ error: 'Invalid state' });
  }
};

// GET /bookings/:id/history
exports.getHistory = async (req, res) => {
  try {
    const history = await BookingStateHistory.findAll({
      where: { booking_id: req.params.id },
      order: [['created_at', 'ASC']],
    });
    res.json(history);
  } catch (error) {
    console.error('Error getting booking history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /bookings/:id/reschedule
exports.reschedule = async (req, res) => {
  try {
    const { new_date, new_time, reason, requested_by } = req.body;

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const reschedule = await Reschedule.create({
      booking_id:   booking.id,
      prev_date:    booking.booked_date,
      prev_time:    booking.start_time,
      new_date,
      new_time:     new_time     || null,
      reason:       reason       || null,
      requested_by: requested_by || 'client',
    });

    await booking.update({
      booked_date: new_date,
      start_time:  new_time || null,
      state:       'rescheduled',
    });

    res.status(201).json(reschedule);
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};