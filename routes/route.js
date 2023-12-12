const express = require('express');
const router = express.Router();
const { controller } = require('../controllers/controller');

router.get('/', controller.index);
router.post('/currentPosition', controller.getCurrentPositionWeather);
router.post('/searchSong', controller.searchSong);

module.exports = router;