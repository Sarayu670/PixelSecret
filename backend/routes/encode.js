const express = require('express');
const { upload, encode } = require('../controllers/encodeController');

const router = express.Router();

router.post('/encode', upload.single('image'), encode);

module.exports = router;
