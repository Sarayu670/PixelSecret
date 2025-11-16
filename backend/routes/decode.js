const express = require('express');
const { upload, decode } = require('../controllers/decodeController');

const router = express.Router();

router.post('/decode', upload.single('image'), decode);

module.exports = router;
