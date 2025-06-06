import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { saveAs } from 'file-saver';

const formatContent = (content) => {
  if (!content) return null;
  
  // Split by bullet points or new lines
  const lines = content.split(/(●|\n)/).filter(line => line.trim() && !['●', '\n'].includes(line));
  
  return lines.map((line, index) => (
    <ListItem key={index} sx={{ py: 0, pl: 0 }}>
      <ListItemText primary={`• ${line.trim()}`} />
    </ListItem>
  ));
};

const ResumeOutput = ({ sections, onDownload }) => {
  if (!sections) return null;

  const handleDownload = () => {
    const content = Object.entries(sections)
      .map(([section, text]) => `## ${section.toUpperCase()}\n\n${text}`)
      .join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'generated-resume.txt');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Generated Resume
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download
        </Button>
      </Box>
      
      {Object.entries(sections).map(([sectionName, content]) => (
        <Paper key={sectionName} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            {sectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {sectionName === 'skills' ? (
            <Typography variant="body1" whiteSpace="pre-line">
              {content}
            </Typography>
          ) : (
            <List dense sx={{ py: 0 }}>
              {formatContent(content)}
            </List>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default ResumeOutput;