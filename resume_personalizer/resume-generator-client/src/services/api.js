import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const generateResume = async (candidateData, jdFile) => {
  const formData = new FormData();
  
  // Normalize skills to array format
  const skillsArray = Array.isArray(candidateData.skills) 
    ? candidateData.skills
    : typeof candidateData.skills === 'string'
      ? candidateData.skills.split(',').map(s => s.trim()).filter(s => s)
      : [];

  const processedData = {
    ...candidateData,
    skills: skillsArray
  };

  formData.append('candidate_data', JSON.stringify(processedData));
  formData.append('jd_file', jdFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/generate_resume/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    if (!response.data?.data?.sections) {
      throw new Error('Invalid response structure');
    }

    return response.data.data;
  } catch (error) {
    let errorMessage = 'Failed to generate resume';
    
    if (error.response) {
      errorMessage = error.response.data?.detail || error.response.statusText;
    } else if (error.request) {
      errorMessage = 'No response from server';
    } else {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};