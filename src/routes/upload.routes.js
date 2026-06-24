const { Router }  = require('express');
const auth        = require('../middlewares/auth.middleware');
const controller  = require('../controllers/upload.controller');
const {
  uploadHero,
  uploadReceipt,
  uploadPortfolio,
} = require('../config/cloudinary.config');

const router = Router();

// ── Artist hero photo (protected) ────────────────────────────
router
  .route('/hero')
  .post(auth, uploadHero.single('image'), controller.uploadHero)
  .delete(auth, controller.deleteHero);

// ── Portfolio images (protected) ─────────────────────────────
router
  .route('/portfolio')
  .post(auth, uploadPortfolio.single('image'), controller.uploadPortfolio);

router
  .route('/portfolio/:id')
  .delete(auth, controller.deletePortfolio);

// ── Payment receipt (public — client uploads) ────────────────
router
  .route('/receipt')
  .post(uploadReceipt.single('file'), controller.uploadReceipt);

module.exports = router;