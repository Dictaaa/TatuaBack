const { Router } = require('express');
const controller = require('../controllers/bookings.controller');
const auth       = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/')
  .get(auth, controller.list)  // GET  /bookings  (artist/admin)
  .post(controller.create);    // POST /bookings  (public — client books)

router
  .route('/:id')
  .get(auth, controller.getOne)     // GET    /bookings/:id
  .put(auth, controller.update)     // PUT    /bookings/:id
  .delete(auth, controller.cancel); // DELETE /bookings/:id  → sets state = cancelled

router
  .route('/:id/state')
  .patch(auth, controller.changeState); // PATCH /bookings/:id/state

router
  .route('/:id/history')
  .get(auth, controller.getHistory);    // GET /bookings/:id/history

router
  .route('/:id/reschedule')
  .post(auth, controller.reschedule);   // POST /bookings/:id/reschedule

module.exports = router;