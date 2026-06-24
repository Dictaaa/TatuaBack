const { Router }  = require('express');
const controller  = require('../controllers/paymentmethods.controller');
const auth        = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/')
  .get(controller.list)           // GET  /payment-methods?artist_id=1  (public)
  .post(auth, controller.create); // POST /payment-methods  (artist creates their own)

router
  .route('/:id')
  .get(controller.getOne)           // GET    /payment-methods/:id
  .put(auth, controller.update)     // PUT    /payment-methods/:id
  .delete(auth, controller.remove); // DELETE /payment-methods/:id

module.exports = router;