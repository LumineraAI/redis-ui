import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyTypeIcon from '../components/KeyTypeIcon';
import DataVisualizer from '../components/DataVisualizer';
import { fetchKeyInfo } from '../api';

const KeyDetails = () => {
  const { key } = useParams();
  const decodedKey = decodeURIComponent(key);
  const [loading, setLoading] = useState(true);
  const [keyData, setKeyData] = useState(null);
  const navigate = useNavigate();

  const fetchKeyData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching details for key: ${decodedKey}`);
      const response = await fetchKeyInfo(decodedKey);
      console.log('Key details data:', response.data);
      setKeyData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching key data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyData();
  }, [decodedKey]);

  const handleRefresh = () => {
    fetchKeyData();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/keys')} 
          sx={{ mr: 2 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Key Details
        </Typography>
        <Tooltip title="Refresh key data">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : keyData ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Key
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        wordBreak: 'break-all',
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        p: 2,
                        borderRadius: 2
                      }}
                    >
                      {decodedKey}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Metadata
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          Type:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <KeyTypeIcon type={keyData.type} />
                          <Typography variant="body1" sx={{ ml: 1 }}>
                            {keyData.type}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          TTL:
                        </Typography>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={keyData.ttl === 'No expiration' ? 'No expiration' : `${keyData.ttl} seconds`}
                          color={keyData.ttl === 'No expiration' ? 'default' : 'primary'}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Value
            </Typography>
            <DataVisualizer type={keyData.type} data={keyData.value} />
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" color="error">
              Key not found or error occurred
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/keys')}
              sx={{ mt: 2 }}
            >
              Back to Key Explorer
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default KeyDetails;