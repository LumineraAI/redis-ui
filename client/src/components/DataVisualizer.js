import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import ReactJson from 'react-json-view';
import { styled } from '@mui/material/styles';
import SimpleJsonView from './SimpleJsonView';

// Fallback component in case ReactJson fails
const JsonFallback = ({ data }) => {
  return <SimpleJsonView data={data} />;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  overflow: 'auto',
  maxHeight: '70vh',
}));

const DataVisualizer = ({ type, data }) => {
  const [useSimpleView, setUseSimpleView] = useState(false);

  if (!data) {
    return (
      <StyledPaper>
        <Typography variant="body1" color="text.secondary">
          No data available
        </Typography>
      </StyledPaper>
    );
  }

  const toggleView = () => {
    setUseSimpleView(!useSimpleView);
  };

  const renderContent = () => {
    switch (type) {
      case 'string':
        // Try to detect if it's JSON
        try {
          const jsonData = JSON.parse(data);
          return (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Chip
                  label="JSON String"
                  color="primary"
                  size="small"
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={toggleView}
                >
                  {useSimpleView ? 'Advanced View' : 'Simple View'}
                </Button>
              </Box>

              {useSimpleView ? (
                <SimpleJsonView data={jsonData} />
              ) : (
                <React.Suspense fallback={<JsonFallback data={jsonData} />}>
                  <ReactJson
                    src={jsonData}
                    theme="rjv-default"
                    displayDataTypes={false}
                    enableClipboard={false}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </React.Suspense>
              )}
            </Box>
          );
        } catch (e) {
          // Not JSON, render as string
          return (
            <Box>
              <Chip 
                label="String" 
                color="primary" 
                size="small" 
                sx={{ mb: 2 }} 
              />
              <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {data}
              </Typography>
            </Box>
          );
        }
      
      case 'list':
        return (
          <Box>
            <Chip 
              label="List" 
              color="secondary" 
              size="small" 
              sx={{ mb: 2 }} 
            />
            {data.map((item, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  borderRadius: 2
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {index}
                </Typography>
                <Typography variant="body2">{item}</Typography>
              </Paper>
            ))}
          </Box>
        );
      
      case 'set':
        return (
          <Box>
            <Chip 
              label="Set" 
              style={{ backgroundColor: '#4caf50', color: 'white' }} 
              size="small" 
              sx={{ mb: 2 }} 
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.map((item, index) => (
                <Chip 
                  key={index} 
                  label={item} 
                  variant="outlined" 
                  style={{ borderColor: '#4caf50' }}
                />
              ))}
            </Box>
          </Box>
        );
      
      case 'zset':
        // For zset, data comes as [member1, score1, member2, score2, ...]
        const zsetPairs = [];
        for (let i = 0; i < data.length; i += 2) {
          zsetPairs.push({ member: data[i], score: data[i + 1] });
        }
        
        return (
          <Box>
            <Chip 
              label="Sorted Set" 
              style={{ backgroundColor: '#ff9800', color: 'white' }} 
              size="small" 
              sx={{ mb: 2 }} 
            />
            {zsetPairs.map((pair, index) => (
              <Paper 
                key={index} 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2">{pair.member}</Typography>
                <Chip 
                  label={`Score: ${pair.score}`} 
                  size="small" 
                  style={{ backgroundColor: '#ff9800', color: 'white' }} 
                />
              </Paper>
            ))}
          </Box>
        );
      
      case 'hash':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Chip
                label="Hash"
                style={{ backgroundColor: '#2196f3', color: 'white' }}
                size="small"
              />
              <Button
                size="small"
                variant="outlined"
                onClick={toggleView}
              >
                {useSimpleView ? 'Advanced View' : 'Simple View'}
              </Button>
            </Box>

            {useSimpleView ? (
              <SimpleJsonView data={data} />
            ) : (
              <React.Suspense fallback={<JsonFallback data={data} />}>
                <ReactJson
                  src={data}
                  theme="rjv-default"
                  displayDataTypes={false}
                  enableClipboard={false}
                  style={{ backgroundColor: 'transparent' }}
                />
              </React.Suspense>
            )}
          </Box>
        );
      
      default:
        return (
          <Typography variant="body1" color="text.secondary">
            Unsupported data type
          </Typography>
        );
    }
  };

  return <StyledPaper>{renderContent()}</StyledPaper>;
};

export default DataVisualizer;