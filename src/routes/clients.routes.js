const { Router } = require('express');
const controller = require('../controllers/clients.controller');
const auth       = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/')
  .get(auth, controller.list)        // GET  /clients
  .post(auth, controller.create);    // POST /clients

router
  .route('/:id')
  .get(auth, controller.getOne)      // GET    /clients/:id
  .put(auth, controller.update)      // PUT    /clients/:id
  .delete(auth, controller.remove);  // DELETE /clients/:id

module.exports = router;