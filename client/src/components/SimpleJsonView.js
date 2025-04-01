import React from 'react';
import { Box, Typography } from '@mui/material';

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
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
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