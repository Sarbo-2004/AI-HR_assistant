import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Grid, Box, Chip,
  InputAdornment, IconButton, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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

  const handleDeleteSkill = (skillToDelete) => {
    formik.setFieldValue(
      'skills',
      formik.values.skills.filter(skill => skill !== skillToDelete)
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        {/* Personal Info */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            autoComplete="on"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            autoComplete="on"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            autoComplete="on"
          />
        </Grid>

        {/* Skills Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Add skill"
              value={formik.values.newSkill}
              onChange={(e) => formik.setFieldValue('newSkill', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddSkill}>
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {formik.values.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleDeleteSkill(skill)}
              />
            ))}
          </Box>
          {formik.touched.skills && formik.errors.skills && (
            <Typography color="error" variant="caption">
              {formik.errors.skills}
            </Typography>
          )}
        </Grid>

        {/* Experience */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Experience"
            name="experience"
            value={formik.values.experience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.experience && Boolean(formik.errors.experience)}
            helperText={formik.touched.experience && formik.errors.experience}
          />
        </Grid>

        {/* Education */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Education"
            name="education"
            value={formik.values.education}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.education && Boolean(formik.errors.education)}
            helperText={formik.touched.education && formik.errors.education}
          />
        </Grid>

        {/* Projects */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Projects"
            name="projects"
            value={formik.values.projects}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.projects && Boolean(formik.errors.projects)}
            helperText={formik.touched.projects && formik.errors.projects}
          />
        </Grid>

        {/* Certifications */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Certifications (optional)"
            name="certifications"
            value={formik.values.certifications}
            onChange={formik.handleChange}
          />
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Continue to JD Upload'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ResumeForm;
