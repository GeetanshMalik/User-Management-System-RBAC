const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate, loginSchema } = require('../validators/userValidator');

router.post('/login', validate(loginSchema), login);
router.get('/me', auth, getMe);

module.exports = router;
