const { Router } = require('express');
const { makeController } = require('../controllers/catalogs.controller');
const auth = require('../middlewares/auth.middleware');
const { TattooType } = require('../models');

const controller = makeController(TattooType, 'Tattoo type');
const router = Router();

router
  .route('/')
  .get(controller.list)
  .post(auth, controller.create);

router
  .route('/:id')
  .get(controller.getOne)
  .put(auth, controller.update)
  .delete(auth, controller.remove);

module.exports = router;