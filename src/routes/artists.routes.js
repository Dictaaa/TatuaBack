const { Router }       = require('express');
const controller       = require('../controllers/artists.controller');
const servicesCtrl     = require('../controllers/services.controller');
const portfolioCtrl    = require('../controllers/portfolio.controller');
const auth             = require('../middlewares/auth.middleware');

const router = Router();

// ── Artist CRUD ───────────────────────────────────────────────
router
  .route('/')
  .get(controller.list)           // GET  /artists
  .post(auth, controller.create); // POST /artists

router
  .route('/slug/:slug')
  .get(controller.getBySlug);     // GET  /artists/slug/:slug  (public profile)

router
  .route('/:id')
  .get(auth, controller.getOne)      // GET    /artists/:id
  .put(auth, controller.update)      // PUT    /artists/:id
  .delete(auth, controller.remove);  // DELETE /artists/:id

// ── Nested: artist services ───────────────────────────────────
router
  .route('/:artist_id/services')
  .get(servicesCtrl.list);           // GET /artists/:artist_id/services  (public)

// ── Nested: artist portfolio ──────────────────────────────────
router
  .route('/:artist_id/portfolio')
  .get(portfolioCtrl.list);          // GET /artists/:artist_id/portfolio  (public)

module.exports = router;