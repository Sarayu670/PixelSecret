const multer = require('multer');
const { decrypt } = require('../utils/crypto');
const { processImage } = require('../utils/exif');

// Reuse upload from encode, but since separate file, redefine or export.
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

const decode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { password } = req.body;

    const extractedText = await processImage(req.file.buffer, null, password, false);

    if (!extractedText) {
      return res.status(404).json({ error: 'No hidden text found in the image' });
    }

    let finalText = extractedText;
    if (password) {
      try {
        finalText = decrypt(extractedText, password);
      } catch (decryptionError) {
        return res.status(400).json({ error: 'Unable to decrypt text. Check password.' });
      }
    }

    res.json({ hiddenText: finalText });
  } catch (error) {
    console.error('Decode error:', error);
    res.status(500).json({ error: 'Failed to decode text from image' });
  }
};

module.exports = { upload, decode };
