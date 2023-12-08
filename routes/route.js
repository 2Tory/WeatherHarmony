const express = require('express');
const router = express.Router();
const { controller } = require('../controllers/controller');

router.get('/', controller.index);
router.post('/currentPosition', controller.getCurrentPositionWeather);

module.exports = router;