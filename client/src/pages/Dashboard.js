import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyTypeIcon from '../components/KeyTypeIcon';
import StatCard from '../components/StatCard';
import { fetchKeys, fetchStats } from '../api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');

        const [keysResponse, statsResponse] = await Promise.all([
          fetchKeys(),
          fetchStats(),
        ]);

        console.log('Keys response:', keysResponse);
        console.log('Stats response:', statsResponse);

        setKeys(keysResponse.data.slice(0, 5)); // Get first 5 keys for preview

        // Use the pre-parsed info from the server
        const parsedInfo = statsResponse.data.parsedInfo;
        console.log('Received parsed Redis INFO from server:', parsedInfo);

        setStats(parsedInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Redis Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Keys"
            value={stats?.keyCount || keys.length || '0'}
            icon={<StorageIcon />}
            color="#dc382c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Memory Usage"
            value={stats?.Memory?.used_memory
              ? `${Math.round(parseInt(stats.Memory.used_memory) / (1024 * 1024))} MB`
              : 'N/A'}
            icon={<MemoryIcon />}
            color="#2b2b2b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Connected Clients"
            value={stats?.Clients?.connected_clients || '1'}
            icon={<PeopleIcon />}
            color="#4caf50"
            onClick={() => navigate('/clients')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Uptime"
            value={stats?.Server?.uptime_in_seconds
              ? `${Math.round(parseInt(stats.Server.uptime_in_seconds) / 3600)} hrs`
              : 'Just started'}
            icon={<AccessTimeIcon />}
            color="#2196f3"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Keys
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => navigate('/keys')}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {keys.length > 0 ? (
                <List>
                  {keys.map((key, index) => (
                    <React.Fragment key={key}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/keys/${encodeURIComponent(key)}`)}
                      >
                        <ListItemIcon>
                          <KeyTypeIcon type="string" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={key} 
                          primaryTypographyProps={{ 
                            noWrap: true,
                            style: { maxWidth: '250px' }
                          }}
                        />
                      </ListItem>
                      {index < keys.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No keys found in the database
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Redis Server Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Redis Version
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {stats?.Server?.redis_version || 'Latest'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    OS
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {stats?.Server?.os || 'Linux/Unix'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Process ID
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {stats?.Server?.process_id || 'Active'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    TCP Port
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {stats?.Server?.tcp_port || '6379'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Keys
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {stats?.keyCount || keys.length || '0'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Connection Status
                  </Typography>
                  <Typography variant="body1" gutterBottom color="success.main">
                    Connected
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => navigate('/stats')}
                  fullWidth
                >
                  View Detailed Stats
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;