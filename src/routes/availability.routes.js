const { Router } = require('express');
const controller = require('../controllers/availability.controller');
const auth       = require('../middlewares/auth.middleware');

const router = Router();

// All routes are nested under /artists/:artist_id/availability/...

router
  .route('/:artist_id/availability/schedule')
  .get(controller.getSchedule)          // GET  /artists/:artist_id/availability/schedule
  .put(auth, controller.setSchedule);   // PUT  /artists/:artist_id/availability/schedule

router
  .route('/:artist_id/availability/exceptions')
  .get(controller.getExceptions)             // GET  /artists/:artist_id/availability/exceptions
  .post(auth, controller.addException);      // POST /artists/:artist_id/availability/exceptions

router
  .route('/:artist_id/availability/exceptions/:id')
  .delete(auth, controller.removeException); // DELETE /artists/:artist_id/availability/exceptions/:id

router
  .route('/:artist_id/availability/calendar')
  .get(controller.getCalendar);             // GET /artists/:artist_id/availability/calendar?year=&month=

module.exports = router;