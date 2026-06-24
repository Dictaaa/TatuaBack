const { Op } = require('sequelize');
const {
  AvailabilitySchedule,
  AvailabilityException,
  Booking,
} = require('../models');

// GET /artists/:artist_id/availability/schedule
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await AvailabilitySchedule.findAll({
      where: { artist_id: req.params.artist_id, is_active: true },
      order: [['day_of_week', 'ASC']],
    });
    res.json(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /artists/:artist_id/availability/schedule
// Body: { slots: [{ day_of_week, start_time, end_time, is_active }] }
exports.setSchedule = async (req, res) => {
  try {
    const artist_id = req.params.artist_id;
    const { slots } = req.body;

    await Promise.all(
      slots.map((slot) =>
        AvailabilitySchedule.upsert({ artist_id, ...slot }),
      ),
    );

    const schedule = await AvailabilitySchedule.findAll({
      where: { artist_id },
      order: [['day_of_week', 'ASC']],
    });

    res.json(schedule);
  } catch (error) {
    console.error('Error setting schedule:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// GET /artists/:artist_id/availability/exceptions?from=&to=
exports.getExceptions = async (req, res) => {
  try {
    const where = { artist_id: req.params.artist_id };
    if (req.query.from && req.query.to) {
      where.date = { [Op.between]: [req.query.from, req.query.to] };
    }

    const exceptions = await AvailabilityException.findAll({
      where,
      order: [['date', 'ASC']],
    });
    res.json(exceptions);
  } catch (error) {
    console.error('Error getting exceptions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /artists/:artist_id/availability/exceptions
exports.addException = async (req, res) => {
  try {
    const exception = await AvailabilityException.create({
      artist_id: req.params.artist_id,
      ...req.body,
    });
    res.status(201).json(exception);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Exception already exists for this date' });
    }
    console.error('Error adding exception:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
};

// DELETE /artists/:artist_id/availability/exceptions/:id
exports.removeException = async (req, res) => {
  try {
    const rows = await AvailabilityException.destroy({
      where: { id: req.params.id, artist_id: req.params.artist_id },
    });
    if (!rows) return res.status(404).json({ error: 'Exception not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error removing exception:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /artists/:artist_id/availability/calendar?year=2025&month=6
exports.getCalendar = async (req, res) => {
  try {
    const artist_id = req.params.artist_id;
    const year  = parseInt(req.query.year)  || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const from = `${year}-${String(month).padStart(2, '0')}-01`;
    const to   = new Date(year, month, 0).toISOString().split('T')[0];

    // 1. Weekly schedule → which day_of_week the artist works
    const schedule = await AvailabilitySchedule.findAll({
      where: { artist_id, is_active: true },
    });
    const workDays = new Set(schedule.map((s) => s.day_of_week));

    // 2. Blocked or special-hours exceptions for the month
    const exceptions = await AvailabilityException.findAll({
      where: { artist_id, date: { [Op.between]: [from, to] } },
    });
    const exceptionMap = {};
    exceptions.forEach((e) => { exceptionMap[e.date] = e.kind; });

    // 3. Dates that already have a confirmed booking
    const booked = await Booking.findAll({
      where: {
        artist_id,
        booked_date: { [Op.between]: [from, to] },
        state: { [Op.notIn]: ['cancelled', 'no_show'] },
      },
      attributes: ['booked_date'],
    });
    const bookedDates = new Set(booked.map((b) => b.booked_date));

    // 4. Build day-by-day response
    const days = [];
    const cursor = new Date(`${from}T12:00:00Z`);
    const end    = new Date(`${to}T12:00:00Z`);

    while (cursor <= end) {
      const dateStr = cursor.toISOString().split('T')[0];
      const dow     = cursor.getUTCDay();

      let state = 'unavailable';

      if (exceptionMap[dateStr] === 'blocked') {
        state = 'blocked';
      } else if (exceptionMap[dateStr] === 'special_hours') {
        state = bookedDates.has(dateStr) ? 'busy' : 'available';
      } else if (workDays.has(dow)) {
        state = bookedDates.has(dateStr) ? 'busy' : 'available';
      }

      days.push({ date: dateStr, state });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    res.json({ artist_id, year, month, days });
  } catch (error) {
    console.error('Error building calendar:', error);
    res.status(500).json({ error: 'Server error' });
  }
};