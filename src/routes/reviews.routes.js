const { Router } = require('express');
const controller = require('../controllers/reviews.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router
  .route('/reviews')
  .get(controller.list)              // GET  /reviews  (public)
  .post(controller.create);          // POST /reviews
 
router
  .route('/reviews/:id')
  .delete(auth, controller.hide);    // DELETE /reviews/:id  (soft hide)

module.exports = router;