import React, { useState } from "react";
import { Box, Alert, Snackbar, Typography, Grid, Paper } from "@mui/material";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import FileUpload from '../components/FileUpload.js';
import ResultsView from '../components/ResultsView.js';
import { uploadAndExtract } from '../utils/api.js';


const Home = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setExtractedData(null);

    try {
      const result = await uploadAndExtract(file);

      if (result.success) {
        setExtractedData(result.data);
        setSuccess("File processed successfully!");
      } else {
        setError(result.error || "Failed to process file");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      console.error("Processing error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleClearResults = () => {
    setExtractedData(null);
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  const handleCopyText = () => {
    setSuccess("Text copied to clipboard!");
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
          SmartHand OCR Processor
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Extract editable text from PDFs, images, and documents
        </Typography>
        <Typography variant="body1" paragraph>
          Upload invoices, salary slips, or any document to convert them into
          Excel, CSV, or editable text formats.
        </Typography>
      </Box>

      {/* File Upload Component */}
      <FileUpload
        onFileSelect={handleFileSelect}
        onFileClear={handleFileClear}
        onUpload={handleUpload}
        file={file}
        loading={uploading}
        error={error}
      />

      {/* Results Component */}
      {extractedData && (
        <ResultsView
          extractedData={extractedData}
          originalFile={file}
          onClear={handleClearResults}
          onCopyText={handleCopyText}
        />
      )}

      {/* How It Works Section */}
      {!extractedData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom color="primary">
            How It Works
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{ p: 3, textAlign: "center", height: "100%" }}
              >
                <Typography variant="h2" color="primary" gutterBottom>
                  1
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Upload
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Drag and drop your document or click to browse
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{ p: 3, textAlign: "center", height: "100%" }}
              >
                <Typography variant="h2" color="primary" gutterBottom>
                  2
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Process
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Our system extracts text and structures your data
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{ p: 3, textAlign: "center", height: "100%" }}
              >
                <Typography variant="h2" color="primary" gutterBottom>
                  3
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Download
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Export in Excel, CSV, or Text format
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          icon={<CheckCircle fontSize="small" />}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          icon={<ErrorIcon fontSize="small" />}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
