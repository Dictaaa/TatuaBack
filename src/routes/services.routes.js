const { Router }  = require('express');
const controller  = require('../controllers/services.controller');
const auth        = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/')
  .get(controller.list)           // GET  /services?artist_id=
  .post(auth, controller.create); // POST /services

router
  .route('/:id')
  .get(controller.getOne)          // GET    /services/:id
  .put(auth, controller.update)    // PUT    /services/:id
  .delete(auth, controller.remove);// DELETE /services/:id

module.exports = router;