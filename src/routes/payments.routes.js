const { Router } = require('express');
const controller = require('../controllers/payments.controller');
const auth       = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/')
  .get(auth, controller.list)  // GET  /payments
  .post(controller.create);    // POST /payments  (client submits receipt)

router
  .route('/:id')
  .get(auth, controller.getOne)     // GET    /payments/:id
  .put(auth, controller.update)     // PUT    /payments/:id
  .delete(auth, controller.remove); // DELETE /payments/:id

router
  .route('/:id/verify')
  .patch(auth, controller.verify);  // PATCH /payments/:id/verify  (artist confirms)

module.exports = router;