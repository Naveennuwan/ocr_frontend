import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { Download, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { downloadFile } from '../utils/api.js';

const DownloadOptions = ({ formats, data, filename }) => {
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDownload = async (format) => {
    setDownloading(format);
    setError(null);

    try {
      const formatConfig = formats.find((f) => f.format === format);
      if (!formatConfig) {
        throw new Error(`Download format ${format} not found`);
      }

      const baseName = filename?.split('.')[0] || 'extracted-data';
      const downloadFilename = `${baseName}.${format}`;

      await downloadFile(
        format,
        formatConfig.endpoint,
        data,
        downloadFilename
      );

      setSuccess(`Downloaded as ${format.toUpperCase()} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to download ${format}: ${err.message}`);
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  };

  const formatIcons = {
    excel: '📊',
    csv: '📄',
    text: '📝',
  };

  const formatColors = {
    excel: 'success',
    csv: 'info',
    text: 'secondary',
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {formats.map((format) => (
          <Grid item xs={12} sm={4} key={format.format}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={
                downloading === format.format ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Download />
                )
              }
              onClick={() => handleDownload(format.format)}
              disabled={downloading !== null}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                p: 2,
                height: '100%',
                bgcolor: `${formatColors[format.format]}.main`,
                '&:hover': {
                  bgcolor: `${formatColors[format.format]}.dark`,
                },
              }}
            >
              <Box textAlign="left">
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Typography variant="h5" sx={{ mr: 1 }}>
                    {formatIcons[format.format]}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {format.format.toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  {format.description}
                </Typography>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default DownloadOptions;