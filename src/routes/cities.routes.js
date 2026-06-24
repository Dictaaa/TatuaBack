const { Router } = require('express');
const controller = require('../controllers/cities.controller');
const auth       = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/')
  .get(controller.list)        // GET  /cities
  .post(auth, controller.create);    // POST /cities

router
  .route('/:id')
  .get(auth, controller.getOne)      // GET    /cities/:id
  .put(auth, controller.update)      // PUT    /cities/:id
  .delete(auth, controller.remove);  // DELETE /cities/:id

module.exports = router;