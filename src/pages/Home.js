import React, { useState } from 'react';
import {
  Box
} from '@mui/material';
import FileUpload from '../components/FileUpload.js';
import ResultsView from '../components/ResultsView.js';
import { uploadAndExtract } from '../utils/api.js';

const Home = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile, errorMsg = null) => {
    setFile(selectedFile);
    setError(errorMsg);
    if (selectedFile) {
      setExtractedData(null);
    }
  };

  const handleFileClear = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadAndExtract(file);
      
      if (result.success) {
        // Add editing metadata
        const dataWithEditInfo = {
          ...result.data,
          isEdited: false,
          editedAt: null,
          originalText: result.data.rawText, // Store original for reference
        };
        
        setExtractedData(dataWithEditInfo);
      } else {
        setError(result.error || 'Failed to process file');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Processing error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleTextUpdate = (updatedData) => {
    setExtractedData(updatedData);
  };

  const handleClearResults = () => {
    setExtractedData(null);
    setFile(null);
    setError(null);
  };

  const handleCopyText = () => {
    // setSuccess('Text copied to clipboard!');
  };

  return (
    <Box>
      {/* Header and other components remain the same */}
      
      {/* File Upload Component */}
      <FileUpload
        onFileSelect={handleFileSelect}
        onFileClear={handleFileClear}
        onUpload={handleUpload}
        file={file}
        loading={uploading}
        error={error}
      />

      {/* Results Component with onTextUpdate callback */}
      {extractedData && (
        <ResultsView
          extractedData={extractedData}
          originalFile={file}
          onClear={handleClearResults}
          onCopyText={handleCopyText}
          onTextUpdate={handleTextUpdate}
        />
      )}

      {/* Snackbars remain the same */}
    </Box>
  );
};

export default Home;