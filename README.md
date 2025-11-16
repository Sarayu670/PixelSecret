# HiddenText — Text Behind Photo (LSB Steganography Web App)

A full-stack web application that allows users to hide secret text within image pixels using LSB steganography and later decode it.

## Features

- **Encode Text**: Upload an image (JPEG/PNG), enter secret text, and optionally encrypt with a password. Download the encoded image.
- **Decode Text**: Upload the encoded image and optionally provide the password to reveal the hidden text.
- **LSB Steganography**: Hides text in the least significant bits of image pixels.
- **AES-256 Encryption**: Secure optional encryption for hidden text.

## Tech Stack

### Backend
- Node.js + Express
- Sharp (image processing)
- LSB Steganography (pixel-level text hiding)
- Multer (file uploads)
- Crypto (encryption)

### Frontend
- React.js
- CSS

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup
1. cd backend
2. npm install
3. npm start
   Server runs on http://localhost:5000

### Frontend Setup
1. cd frontend
2. npm install
3. npm start
   App runs on http://localhost:3000

## API Endpoints

### POST /encode
- **Input**: Multipart/form-data with image file, text, optional password
- **Output**: Encoded image download

### POST /decode
- **Input**: Multipart/form-data with image file, optional password
- **Output**: JSON with { hiddenText: "decoded text" }

## Usage

1. Start both backend and frontend servers.
2. Open http://localhost:3000 in browser.
3. Encode: Select image, enter text, optional password, click "Encode & Download".
4. Decode: Select encoded image, optional password, click "Decode Text".

## Security Note
Text is embedded in image pixels using LSB steganography. Hidden text is invisible to casual inspection. If encrypted, uses AES-256 with salt and IV.
