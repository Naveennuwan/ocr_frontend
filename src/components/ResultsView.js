import React, { useState } from 'react'; // Add useState
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy,
  CheckCircle,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import DownloadOptions from './DownloadOptions.js';

const ResultsView = ({ extractedData, originalFile, onClear, onCopyText, onTextUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(extractedData?.rawText || '');
  const [originalText, setOriginalText] = useState(extractedData?.rawText || '');

  if (!extractedData) return null;

  const handleCopyText = () => {
    if (extractedData.rawText) {
      navigator.clipboard.writeText(extractedData.rawText);
      onCopyText?.();
    }
  };

  const handleEditStart = () => {
    setOriginalText(extractedData.rawText);
    setEditedText(extractedData.rawText);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    // Update the extractedData with edited text
    const updatedData = {
      ...extractedData,
      rawText: editedText,
      isEdited: true,
      editedAt: new Date().toISOString(),
    };
    
    // Call parent callback to update data
    onTextUpdate?.(updatedData);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedText(originalText);
    setIsEditing(false);
  };

  // Use edited text if available
  const displayText = isEditing ? editedText : extractedData.rawText;

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <CheckCircle color="success" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Extraction Complete
              {extractedData.isEdited && (
                <Chip
                  label="Edited"
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {displayText.length.toLocaleString()} characters
              {extractedData.isEdited && ' (edited)'}
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
          <Tooltip title={isEditing ? "Save changes" : "Edit text"}>
            <IconButton
              onClick={isEditing ? handleEditSave : handleEditStart}
              color={isEditing ? "success" : "primary"}
              sx={{ mr: 1 }}
            >
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </Tooltip>
          {isEditing && (
            <Tooltip title="Cancel editing">
              <IconButton
                onClick={handleEditCancel}
                color="error"
                sx={{ mr: 1 }}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          )}
          <Button variant="outlined" onClick={onClear}>
            Clear
          </Button>
        </Box>
      </Box>

      {/* Download Options - Pass edited data */}
      {extractedData.downloadFormats && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Download Options
          </Typography>
          <DownloadOptions
            formats={extractedData.downloadFormats}
            data={extractedData} // This will include edited text
            filename={originalFile?.name}
            isEdited={extractedData.isEdited}
          />
        </Box>
      )}

      {/* Raw Text Editor */}
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            {isEditing ? 'Editing Text' : 'Extracted Text'}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={`${displayText.length.toLocaleString()} chars`}
              size="small"
            />
            {isEditing && (
              <Chip
                label="Editing Mode"
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Box>
        
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={12}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              },
            }}
          />
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              maxHeight: 400,
              overflow: 'auto',
              backgroundColor: '#fafafa',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={handleEditStart}
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
              {displayText}
            </Typography>
          </Paper>
        )}
        
        {isEditing && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleEditCancel}
              color="error"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleEditSave}
              color="success"
            >
              Save Changes
            </Button>
          </Box>
        )}
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