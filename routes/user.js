const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/users',userController.getAllUserIds);

module.exports = router;