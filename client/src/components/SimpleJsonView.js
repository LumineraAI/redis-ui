import React from 'react';
import { Box, Typography } from '@mui/material';

// Helper function to format labels (copied from Stats.js)
const formatLabel = (str) => {
  if (!str) return '';
  // Replace underscores with spaces, handle camelCase, and capitalize words
  const spaced = str.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1');
  return spaced
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const SimpleJsonView = ({ data }) => {
  // Function to format JSON with syntax highlighting
  const formatJSON = (json) => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) { // It's a key
            cls = 'json-key';
            // Extract key, format it, and reconstruct
            const key = match.substring(1, match.indexOf('":')); // Extract key without quotes
            const formattedKey = formatLabel(key);
            return `<span class="${cls}">"${formattedKey}"</span>:`; // Reconstruct with formatted key
          } else { // It's a string value
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        // For non-key matches, return as before
        return `<span class="${cls}">${match}</span>`;
      });
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5', 
      p: 2, 
      borderRadius: 1, 
      maxHeight: '500px', 
      overflow: 'auto',
      '& .json-key': { color: '#0b7285' },
      '& .json-string': { color: '#2b8a3e' },
      '& .json-number': { color: '#5f3dc4' },
      '& .json-boolean': { color: '#e67700' },
      '& .json-null': { color: '#868e96' }
    }}>
      <pre 
        style={{ margin: 0 }}
        dangerouslySetInnerHTML={{ __html: formatJSON(data) }}
      />
    </Box>
  );
};

export default SimpleJsonView;