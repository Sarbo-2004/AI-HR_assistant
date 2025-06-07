import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Grid, Box, Chip,
  InputAdornment, IconButton, Typography,
  Paper, Accordion, AccordionSummary, AccordionDetails,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  CardMembership as CertIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SectionHeader = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
  },
}));

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10,}$/, 'Must be valid phone number'),
  education: Yup.string().required('Education is required'),
  experience: Yup.string().required('Experience is required'),
  skills: Yup.array().of(Yup.string()).min(1, 'At least one skill is required'),
  certifications: Yup.string(),
  projects: Yup.string(),
});

const ResumeForm = ({ onSubmit, isSubmitting }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      education: '',
      experience: '',
      skills: [],
      newSkill: '',
      certifications: '',
      projects: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        skills: values.skills.filter(skill => skill.trim() !== ''),
      });
    },
  });

  const handleAddSkill = () => {
    const skill = formik.values.newSkill.trim();
    if (skill && !formik.values.skills.includes(skill)) {
      formik.setFieldValue('skills', [...formik.values.skills, skill]);
      formik.setFieldValue('newSkill', '');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    formik.setFieldValue(
      'skills',
      formik.values.skills.filter(skill => skill !== skillToDelete)
    );
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Resume Information
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        {/* Personal Information Section - Now Collapsible */}
        <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionHeader variant="h6">
              <PersonIcon fontSize="small" />
              Personal Information
            </SectionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  size="small"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Skills Section - Now Collapsible */}
        <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionHeader variant="h6">
              <CodeIcon fontSize="small" />
              Skills
            </SectionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <StyledTextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Add skill and press Enter"
                  value={formik.values.newSkill}
                  onChange={(e) => formik.setFieldValue('newSkill', e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleAddSkill}
                          color="primary"
                          disabled={!formik.values.newSkill.trim()}
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formik.values.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
              {formik.touched.skills && formik.errors.skills && (
                <Typography color="error" variant="caption">
                  {formik.errors.skills}
                </Typography>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Experience Section */}
        <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionHeader variant="h6">
              <WorkIcon fontSize="small" />
              Work Experience
            </SectionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <StyledTextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              label="Describe your work experience in detail"
              name="experience"
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.experience && Boolean(formik.errors.experience)}
              helperText={formik.touched.experience && formik.errors.experience}
              size="small"
            />
          </AccordionDetails>
        </Accordion>

        {/* Education Section */}
        <Accordion defaultExpanded elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionHeader variant="h6">
              <SchoolIcon fontSize="small" />
              Education
            </SectionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <StyledTextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              label="Your educational background"
              name="education"
              value={formik.values.education}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.education && Boolean(formik.errors.education)}
              helperText={formik.touched.education && formik.errors.education}
              size="small"
            />
          </AccordionDetails>
        </Accordion>

        {/* Projects Section */}
        <Accordion elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionHeader variant="h6">
              <CodeIcon fontSize="small" />
              Projects
            </SectionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <StyledTextField
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              label="Notable projects you've worked on"
              name="projects"
              value={formik.values.projects}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.projects && Boolean(formik.errors.projects)}
              helperText={formik.touched.projects && formik.errors.projects}
              size="small"
            />
          </AccordionDetails>
        </Accordion>

        {/* Certifications Section */}
        <Accordion elevation={0} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionHeader variant="h6">
              <CertIcon fontSize="small" />
              Certifications
            </SectionHeader>
          </AccordionSummary>
          <AccordionDetails>
            <StyledTextField
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              label="Any relevant certifications (optional)"
              name="certifications"
              value={formik.values.certifications}
              onChange={formik.handleChange}
              size="small"
            />
          </AccordionDetails>
        </Accordion>

        {/* Submit Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting || !formik.isValid}
            sx={{
              py: 1.5,
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {isSubmitting ? 'Generating Resume...' : 'Continue to JD Upload'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ResumeForm;