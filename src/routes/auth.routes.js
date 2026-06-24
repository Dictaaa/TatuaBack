const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const auth       = require('../middlewares/auth.middleware');

const router = Router();

router.post('/register', controller.register); // POST /auth/register
router.post('/login',    controller.login);    // POST /auth/login
router.post('/logout',   auth, controller.logout);  // POST /auth/logout
router.get ('/me',       auth, controller.me);       // GET  /auth/me

module.exports = router;