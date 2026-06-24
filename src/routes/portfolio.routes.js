const { Router }  = require('express');
const controller  = require('../controllers/portfolio.controller');
const auth        = require('../middlewares/auth.middleware');

const router = Router();

// Standalone portfolio routes (for update/delete by item id)
router
  .route('/:id')
  .get(controller.getOne)           // GET    /portfolio/:id
  .put(auth, controller.update)     // PUT    /portfolio/:id
  .delete(auth, controller.remove); // DELETE /portfolio/:id

module.exports = router;