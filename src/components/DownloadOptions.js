import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { downloadFile } from '../utils/api.js';

const DownloadOptions = ({ formats, data, filename, isEdited }) => {
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

      // Prepare data for download with editing info
      const downloadData = {
        ...data,
        // Include editing metadata in download
        metadata: {
          originalFilename: filename,
          downloadedAt: new Date().toISOString(),
          isEdited: isEdited || false,
          editedAt: data.editedAt || null,
          characterCount: data.rawText.length,
        }
      };
      
      const formatToExtension = {
        excel: 'xlsx',
        csv: 'csv',
        text: 'text',
      };
      
      const baseName = filename?.split('.')[0] || 'extracted-data';
      const fileExtension = formatToExtension[format] || format;
      const downloadFilename = `${baseName}${isEdited ? '-edited' : ''}.${fileExtension}`;

      await downloadFile(
        format,
        formatConfig.endpoint,
        downloadData,
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

  const formatDescriptions = {
    excel: 'Best for structured data',
    csv: 'Simple spreadsheet format',
    text: 'Plain text with formatting',
  };

  return (
    <Box>
      {isEdited && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Download will include your edited text
        </Alert>
      )}
      
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
                  {isEdited && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        ml: 1, 
                        bgcolor: 'warning.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem'
                      }}
                    >
                      Edited
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" color="rgba(255,255,255,0.8)">
                  {formatDescriptions[format.format] || format.description}
                </Typography>
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Success/Error Snackbars remain the same */}
    </Box>
  );
};

export default DownloadOptions;