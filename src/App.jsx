import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      let raw = res.data.prediction || '';
      raw = raw.toLowerCase().replace(/[\s-_]/g, '');

      // Matching logic
      if (raw.includes('notaffected')) {
        setResult('NON-AFFECTED');
      } else if (raw.includes('affected')) {
        setResult('AFFECTED');
      } else {
        setResult('UNKNOWN');
      }

    } catch (error) {
      setResult('Error: ' + (error.response?.data?.error || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="content">
        <h1>OSTEOSARCOMA DETECTION</h1>
        <h3>Upload an image</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Checking...' : 'Upload & Predict'}
        </button>
        <br />
        {loading && <p>Loading...</p>}
        {result && (
          <h3>
            <strong>Result:</strong>{' '}
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{result}</span>
          </h3>
        )}
      </div>
    </div>
  );
}

export default App;
