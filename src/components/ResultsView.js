import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  ContentCopy,
  Download,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import DownloadOptions from './DownloadOptions.js';

const ResultsView = ({ extractedData, originalFile, onClear, onCopyText }) => {
  if (!extractedData) return null;

  const handleCopyText = () => {
    if (extractedData.rawText) {
      navigator.clipboard.writeText(extractedData.rawText);
      onCopyText?.();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <CheckCircle color="success" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Extraction Complete
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {extractedData.rawText.length.toLocaleString()} characters extracted
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            startIcon={<ContentCopy />}
            onClick={handleCopyText}
            sx={{ mr: 1 }}
          >
            Copy Text
          </Button>
          <Button variant="outlined" onClick={onClear}>
            Clear
          </Button>
        </Box>
      </Box>

      {/* Download Options */}
      {extractedData.downloadFormats && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Download Options
          </Typography>
          <DownloadOptions
            formats={extractedData.downloadFormats}
            data={extractedData}
            filename={originalFile?.name}
          />
        </Box>
      )}

      {/* Structured Data */}
      {extractedData.structuredData &&
        Object.keys(extractedData.structuredData).length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Structured Information
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(extractedData.structuredData).map(
                ([key, value], index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                      >
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {value}
                      </Typography>
                    </Paper>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        )}

      {/* Raw Text */}
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Extracted Text</Typography>
          <Chip
            label={`${extractedData.rawText.length.toLocaleString()} chars`}
            size="small"
          />
        </Box>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            maxHeight: 400,
            overflow: 'auto',
            backgroundColor: '#fafafa',
          }}
        >
          <Typography
            variant="body2"
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {extractedData.rawText}
          </Typography>
        </Paper>
      </Box>

      {/* Statistics */}
      {extractedData.entities || extractedData.tables ? (
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Extraction Statistics
          </Typography>
          <Grid container spacing={2}>
            {extractedData.entities && (
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">
                    {extractedData.entities.length}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Entities Found
                  </Typography>
                </Box>
              </Grid>
            )}
            {extractedData.tables && (
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">
                    {extractedData.tables.length}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tables Detected
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      ) : null}
    </Paper>
  );
};

export default ResultsView;