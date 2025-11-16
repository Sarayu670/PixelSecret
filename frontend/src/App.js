import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError('');
    setDecodedText('');
  };

  const handleEncode = async () => {
    if (!selectedFile || !text) {
      setError('Please select an image and enter text to encode');
      return;
    }

    // Check file size (mobile limitation)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Image too large. Please use an image smaller than 5MB.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('text', text);
    if (password) formData.append('password', password);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/encode`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        
        // Universal download for all devices
        const url = window.URL.createObjectURL(blob);
        
        // Try direct download first
        const a = document.createElement('a');
        a.href = url;
        a.download = 'encoded_image.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        
        try {
          a.click();
        } catch (err) {
          // Fallback for devices that don't support direct download
          window.open(url, '_blank');
        }
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show success message
        setError('');
        alert('Image encoded successfully! Check your downloads folder.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to encode image');
      }
    } catch (err) {
      console.error('Encode error:', err);
      setError(`Error: ${err.message || 'Failed to encode image. Please try again.'}`);
    }

    setLoading(false);
  };

  const handleDecode = async () => {
    if (!selectedFile) {
      setError('Please select an image to decode');
      return;
    }

    setLoading(true);
    setError('');
    setDecodedText('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    if (password) formData.append('password', password);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/decode`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setDecodedText(data.hiddenText);
      } else {
        setError(data.error || 'Failed to decode image');
      }
    } catch (err) {
      setError('Network error. Make sure backend is running on port 5000.');
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PixelSecret- Text Behind Photo</h1>
        <p>Hide and reveal secret text in image</p>
      </header>

      <main className="App-main">
        <div className="upload-section">
          <label htmlFor="file-input" className="file-label">
            Choose Image (JPEG/PNG)
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*,image/jpeg,image/jpg,image/png"
            capture="environment"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <p className="file-name">Selected: {selectedFile.name}</p>
          )}
        </div>

        <div className="input-section">
          <textarea
            placeholder="Enter secret text to encode..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-input"
            rows="4"
          />
          
          <input
            type="password"
            placeholder="Optional password for encryption"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
        </div>

        <div className="button-section">
          <button
            onClick={handleEncode}
            disabled={loading}
            className="encode-btn"
          >
            {loading ? 'Processing...' : 'Encode & Download'}
          </button>
          
          <button
            onClick={handleDecode}
            disabled={loading}
            className="decode-btn"
          >
            {loading ? 'Processing...' : 'Decode Text'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        
        {decodedText && (
          <div className="decoded-section">
            <h3>Decoded Text:</h3>
            <div className="decoded-text">{decodedText}</div>
          </div>
        )}
      </main>
      
      <footer className="App-footer">
        <p>Created by Sarayu Pittala - with love ❤️</p>
      </footer>
    </div>
  );
}

export default App;
