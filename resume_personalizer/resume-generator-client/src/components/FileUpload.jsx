import { Button, Typography, Box, Alert } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useState } from 'react';

const FileUpload = ({ onFileChange, acceptedFiles = '.pdf,.txt' }) => {
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size too large (max 5MB)');
      return;
    }
    
    if (!acceptedFiles.split(',').some(ext => file.name.toLowerCase().endsWith(ext))) {
      setFileError(`Only ${acceptedFiles} files are allowed`);
      return;
    }
    
    setFileError(null);
    onFileChange(file);
  };

  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <input
        accept={acceptedFiles}
        style={{ display: 'none' }}
        id="jd-upload"
        type="file"
        onChange={(e) => handleFileChange(e.target.files[0])}
      />
      <label htmlFor="jd-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadIcon />}
          size="large"
          sx={{ mb: 2 }}
        >
          Upload Job Description
        </Button>
      </label>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Supported formats: PDF or TXT (max 5MB)
      </Typography>
      {fileError && (
        <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
          {fileError}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;