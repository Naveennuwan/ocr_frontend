import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  Grid,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { validateFile } from '../utils/api.js';

const FileUpload = ({
  onFileSelect,
  onFileClear,
  onUpload,
  file,
  loading,
}) => {
  const onDrop = React.useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        const validation = validateFile(selectedFile);

        if (validation.isValid) {
          onFileSelect(selectedFile);
        } else {
          onFileSelect(null, validation.errors[0]);
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (file?.name.includes('.pdf')) return '📄';
    if (file?.name.match(/\.(jpg|jpeg|png)$/i)) return '🖼️';
    if (file?.name.match(/\.(doc|docx)$/i)) return '📝';
    return '📎';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Upload Document
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            {...getRootProps()}
            sx={{
              border: isDragActive
                ? '2px dashed #1976d2'
                : '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: isDragActive
                ? 'rgba(25, 118, 210, 0.04)'
                : '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderColor: '#1976d2',
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload
              sx={{
                fontSize: 48,
                color: isDragActive ? '#1976d2' : '#9e9e9e',
                mb: 2,
                transition: 'all 0.3s ease',
              }}
            />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop your file here' : 'Drag & drop files here'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to browse
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          {file && (
            <Card
              variant="outlined"
              sx={{
                borderLeft: '4px solid',
                borderColor: 'primary.main',
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Typography
                      variant="h4"
                      sx={{ mr: 2, lineHeight: 1 }}
                    >
                      {getFileIcon()}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" noWrap>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={onFileClear} size="small" color="error">
                    <Delete />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={onUpload}
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CloudUpload />
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Processing...' : 'Extract Text'}
                </Button>
              </CardContent>
            </Card>
          )}

          {!file && (
            <Card variant="outlined">
              <CardContent>
                <Box textAlign="center" py={2}>
                  <Typography variant="body1" color="textSecondary">
                    No file selected
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Drag and drop a file or browse to select one
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FileUpload;