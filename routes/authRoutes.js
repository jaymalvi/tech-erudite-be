const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/customer', (req, res) => {
  req.body.role = 'customer';
  authController.registerUser(req, res);
});
router.post('/register/admin', (req, res) => {
  req.body.role = 'admin';
  authController.registerUser(req, res);
});
router.post('/verify-email', authController.verifyEmail);
router.post('/admin-login', authController.loginAdmin);

module.exports = router;
