import { useState } from 'react';
import { generateResume } from '../services/api';
import ResumeForm from '../components/ResumeForm';
import FileUpload from '../components/FileUpload';
import ResumeOutput from '../components/ResumeOutput';
import { 
  Box, 
  CircularProgress, 
  Alert, 
  Typography,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper
} from '@mui/material';

const steps = ['Enter Details', 'Upload JD', 'Generate Resume'];

const GeneratorPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [jdFile, setJdFile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleFormSubmit = (data) => {
    setFormData(data);
    handleNext();
  };

  const handleFileUpload = (file) => {
    setJdFile(file);
  };

  // const handleFinalSubmit = async () => {
  //   if (!jdFile) {
  //     setError('Please upload a job description file');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await generateResume(formData, jdFile);
  //     setResumeData(response.sections);
  //     handleNext();
  //   } catch (err) {
  //     setError(err.message || 'Failed to generate resume');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFinalSubmit = async () => {
  if (!jdFile) {
    setError('Please upload a job description file');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    
    const response = await generateResume(formData, jdFile);
    
    // Validate response
    if (!response?.sections) {
      throw new Error('Received empty sections from server');
    }
    
    setResumeData(response.sections);
    handleNext();
    
  } catch (err) {
    console.error('Generation Error:', {
      message: err.message,
      stack: err.stack
    });
    
    setError(err.message);
    
    // If error occurs after moving to step 2, go back to step 1
    if (activeStep === 2) setActiveStep(1);
    
  } finally {
    setLoading(false);
  }
};

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        AI-Powered Resume Generator
      </Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4 }}>
        {activeStep === 0 && (
          <ResumeForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={loading}
          />
        )}
        
        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Upload Job Description (PDF or TXT)
            </Typography>
            <FileUpload 
              onFileChange={handleFileUpload} 
              acceptedFiles=".pdf,.txt"
            />
            {jdFile && (
              <Paper elevation={1} sx={{ p: 2, mt: 2, maxWidth: 400, mx: 'auto' }}>
                <Typography variant="subtitle1">Selected file:</Typography>
                <Typography variant="body2">{jdFile.name}</Typography>
                <Typography variant="caption">
                  {(jdFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Paper>
            )}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={handleFinalSubmit}
                disabled={!jdFile || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Resume'}
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && resumeData && (
          <Box>
            <ResumeOutput sections={resumeData} />
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setActiveStep(0)}
              >
                Start Over
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  setActiveStep(0);
                  setResumeData(null);
                  setJdFile(null);
                  setFormData(null);
                }}
              >
                Generate Another
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default GeneratorPage;