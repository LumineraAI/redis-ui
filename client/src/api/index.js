import axios from 'axios';

// Create an axios instance with the base URL pointing to the server
const API = axios.create({
  baseURL: 'http://localhost:5001', // Use the port your server is running on
  timeout: 10000,
});

// Export API methods
export const fetchKeys = () => API.get('/api/keys');
export const fetchKeyInfo = (key) => API.get(`/api/keys/${encodeURIComponent(key)}`);
export const fetchStats = () => API.get('/api/stats');
export const fetchClients = () => API.get('/api/clients');
export const killClient = (clientData) => API.post('/api/clients/kill', clientData);

export default API;