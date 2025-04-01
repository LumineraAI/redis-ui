import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Pagination,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyTypeIcon from '../components/KeyTypeIcon';
import { fetchKeys, fetchKeyInfo } from '../api';

const KeyExplorer = () => {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [keyTypes, setKeyTypes] = useState({});
  const navigate = useNavigate();
  const keysPerPage = 20;

  const fetchAllKeys = async () => {
    try {
      setLoading(true);
      console.log('Fetching all keys...');
      const response = await fetchKeys();
      console.log('Fetched keys:', response.data);

      setKeys(response.data);
      setFilteredKeys(response.data);
      setLoading(false);

      // Fetch type for first page keys
      const firstPageKeys = response.data.slice(0, keysPerPage);
      fetchKeyTypes(firstPageKeys);
    } catch (error) {
      console.error('Error fetching keys:', error);
      setLoading(false);
    }
  };

  const fetchKeyTypes = async (keysToFetch) => {
    const types = { ...keyTypes };

    for (const key of keysToFetch) {
      if (!types[key]) {
        try {
          console.log(`Fetching info for key: ${key}`);
          const response = await fetchKeyInfo(key);
          console.log(`Key ${key} info:`, response.data);
          types[key] = response.data.type;
        } catch (error) {
          console.error(`Error fetching type for key ${key}:`, error);
          types[key] = 'unknown';
        }
      }
    }

    console.log('Updated key types:', types);
    setKeyTypes(types);
  };

  useEffect(() => {
    fetchAllKeys();
  }, []);

  useEffect(() => {
    const filtered = keys.filter(key =>
      key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKeys(filtered);
    setPage(1);
  }, [searchTerm, keys]);

  useEffect(() => {
    // Fetch types for keys on the current page
    const startIndex = (page - 1) * keysPerPage;
    const endIndex = startIndex + keysPerPage;
    const currentPageKeys = filteredKeys.slice(startIndex, endIndex);

    fetchKeyTypes(currentPageKeys);
  }, [page, filteredKeys]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    fetchAllKeys();
  };

  const paginatedKeys = filteredKeys.slice(
    (page - 1) * keysPerPage,
    page * keysPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Key Explorer
        </Typography>
        <Tooltip title="Refresh keys">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search keys..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Keys
            </Typography>
            <Chip 
              label={`${filteredKeys.length} keys found`} 
              color="primary" 
              variant="outlined" 
            />
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : paginatedKeys.length > 0 ? (
            <>
              <List>
                {paginatedKeys.map((key, index) => (
                  <React.Fragment key={key}>
                    <ListItem 
                      button 
                      onClick={() => navigate(`/keys/${encodeURIComponent(key)}`)}
                    >
                      <ListItemIcon>
                        <KeyTypeIcon type={keyTypes[key] || 'unknown'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={key} 
                        primaryTypographyProps={{ 
                          style: { wordBreak: 'break-all' } 
                        }}
                      />
                    </ListItem>
                    {index < paginatedKeys.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.ceil(filteredKeys.length / keysPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No keys found matching your search
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default KeyExplorer;