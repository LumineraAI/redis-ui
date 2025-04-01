import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchStats } from '../api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching Redis stats...');
        const response = await fetchStats();

        // Use the pre-parsed info from the server
        const parsedInfo = response.data.parsedInfo;
        console.log('Stats page - Received parsed Redis INFO from server:', parsedInfo);

        // Extract sections
        const sectionsList = Object.keys(parsedInfo).filter(key =>
          typeof parsedInfo[key] === 'object' && parsedInfo[key] !== null
        );

        setStats(parsedInfo);
        setSections(sectionsList.filter(section => section !== ''));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    getStats();
  }, []);

  // Default memory values if stats are not available
  const defaultMemoryValues = [10, 15, 12]; // MB

  const memoryData = {
    labels: ['Used Memory', 'Used Memory RSS', 'Used Memory Peak'],
    datasets: [
      {
        label: 'Memory Usage (MB)',
        data: stats.Memory ? [
          Math.round(parseInt(stats.Memory.used_memory || '0') / (1024 * 1024)),
          Math.round(parseInt(stats.Memory.used_memory_rss || '0') / (1024 * 1024)),
          Math.round(parseInt(stats.Memory.used_memory_peak || '0') / (1024 * 1024)),
        ] : defaultMemoryValues,
        backgroundColor: [
          'rgba(220, 56, 44, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(220, 56, 44, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Default command values if stats are not available
  const defaultCommandValues = [100, 80, 20];

  const commandsData = {
    labels: ['Total Commands', 'Keyspace Hits', 'Keyspace Misses'],
    datasets: [
      {
        label: 'Commands Stats',
        data: stats.Stats ? [
          parseInt(stats.Stats.total_commands_processed || '0'),
          parseInt(stats.Stats.keyspace_hits || '0'),
          parseInt(stats.Stats.keyspace_misses || '0'),
        ] : defaultCommandValues,
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

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
        Redis Stats
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Memory Usage
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={memoryData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Commands Stats
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={commandsData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Detailed Stats
      </Typography>

      {sections.map((section) => (
        <Accordion key={section} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{section}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(stats[section] || {}).map(([key, value]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <Card variant="outlined" sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                      <Typography variant="caption" color="text.secondary">
                        {key}
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Stats;