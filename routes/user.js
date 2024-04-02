const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/users', userController.getAllUserIds);
router.delete('/deleteUser/:userId', userController.deleteUser);
module.exports = router;