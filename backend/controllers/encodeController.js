const multer = require('multer');
const { encrypt } = require('../utils/crypto');
const { processImage } = require('../utils/exif');

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const encode = async (req, res) => {
  try {
    console.log('Encode request received');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    console.log('Text length:', req.body.text ? req.body.text.length : 0);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { text, password } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text to encode is required' });
    }

    let finalText = text;
    if (password) {
      console.log('Encrypting text with password');
      finalText = encrypt(text, password);
    }

    console.log('Processing image...');
    const encodedBuffer = await processImage(req.file.buffer, finalText, password, true);
    console.log('Image processed successfully, buffer size:', encodedBuffer.length);

    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="encoded_image.png"'
    });
    res.send(encodedBuffer);
  } catch (error) {
    console.error('Encode error details:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: `Failed to encode text in image: ${error.message}` });
  }
};

module.exports = { upload, encode };
