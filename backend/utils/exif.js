const sharp = require('sharp');

// Convert text to binary string
function textToBinary(text) {
  return text.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

// Convert binary string to text
function binaryToText(binary) {
  const chars = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    if (byte.length === 8) {
      chars.push(String.fromCharCode(parseInt(byte, 2)));
    }
  }
  return chars.join('');
}

// Embed text in image using LSB steganography
async function embedTextInImage(imageBuffer, text) {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const binaryText = textToBinary(text + '###END###');
  const pixels = new Uint8Array(data);

  if (binaryText.length > pixels.length) {
    throw new Error('Text too long for this image');
  }

  for (let i = 0; i < binaryText.length; i++) {
    const bit = parseInt(binaryText[i]);
    pixels[i] = (pixels[i] & 0xFE) | bit;
  }

  return await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  }).png().toBuffer();
}

// Extract text from image using LSB steganography
async function extractTextFromImage(imageBuffer) {
  const { data } = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(data);

  const endMarker = '###END###';
  const endMarkerBinary = textToBinary(endMarker);
  const binaryBits = [];
  
  // Extract bits more efficiently
  for (let i = 0; i < pixels.length; i++) {
    binaryBits.push(pixels[i] & 1);
    
    // Check for end marker every 8 bits (1 byte)
    if (binaryBits.length >= endMarkerBinary.length && binaryBits.length % 8 === 0) {
      // Convert last bits to check for end marker
      const recentBits = binaryBits.slice(-endMarkerBinary.length).join('');
      if (recentBits === endMarkerBinary) {
        // Found end marker, extract the text (excluding end marker)
        const textBits = binaryBits.slice(0, -endMarkerBinary.length).join('');
        return binaryToText(textBits);
      }
    }
  }

  return null;
}

// Process image using LSB steganography
async function processImage(inputBuffer, text, password, isEncode) {
  try {
    if (isEncode) {
      return await embedTextInImage(inputBuffer, text);
    } else {
      return await extractTextFromImage(inputBuffer);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  processImage
};