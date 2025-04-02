require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create Redis client
let redisClient;

async function connectRedis() {
  try {
    console.log('Attempting to connect to Redis at:', process.env.REDIS_URL || 'redis://localhost:6379');

    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`Redis reconnect attempt: ${retries}`);
          return Math.min(retries * 50, 1000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    await redisClient.connect();
    console.log('Connected to Redis successfully');

    // Test connection by setting a key
    await redisClient.set('test:connection', 'Connected at ' + new Date().toISOString());
    const testValue = await redisClient.get('test:connection');
    console.log('Test connection value:', testValue);

  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

connectRedis();

// API Routes

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    // Execute the CLIENT LIST command
    const clientList = await redisClient.sendCommand(['CLIENT', 'LIST']);

    // Parse the client list response
    const clients = clientList.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const clientInfo = {};
        line.split(' ').forEach(item => {
          const [key, value] = item.split('=');
          if (key && value) {
            clientInfo[key] = value;
          }
        });
        return clientInfo;
      });

    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients', message: error.message });
  }
});

// Kill a client
app.post('/api/clients/kill', async (req, res) => {
  try {
    const { addr, id } = req.body;

    if (!addr && !id) {
      return res.status(400).json({ error: 'Either client address or ID is required' });
    }

    let result;
    if (id) {
      // Kill by ID
      result = await redisClient.sendCommand(['CLIENT', 'KILL', 'ID', id]);
    } else {
      // Kill by address
      result = await redisClient.sendCommand(['CLIENT', 'KILL', 'ADDR', addr]);
    }

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error killing client:', error);
    res.status(500).json({ error: 'Failed to kill client', message: error.message });
  }
});

// Get all keys
app.get('/api/keys', async (req, res) => {
  try {
    const keys = await redisClient.keys('*');
    res.json(keys);
  } catch (error) {
    console.error('Error fetching keys:', error);
    res.status(500).json({ error: 'Failed to fetch keys' });
  }
});

// Get key info
app.get('/api/keys/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const type = await redisClient.type(key);
    
    let value;
    switch(type) {
      case 'string':
        value = await redisClient.get(key);
        break;
      case 'list':
        value = await redisClient.lRange(key, 0, -1);
        break;
      case 'set':
        value = await redisClient.sMembers(key);
        break;
      case 'zset':
        value = await redisClient.zRange(key, 0, -1, { WITHSCORES: true });
        break;
      case 'hash':
        value = await redisClient.hGetAll(key);
        break;
      default:
        value = null;
    }
    
    const ttl = await redisClient.ttl(key);
    
    res.json({
      key,
      type,
      value,
      ttl: ttl === -1 ? 'No expiration' : ttl
    });
  } catch (error) {
    console.error('Error fetching key info:', error);
    res.status(500).json({ error: 'Failed to fetch key info' });
  }
});

// Get database stats
app.get('/api/stats', async (req, res) => {
  try {
    // Add some sample data if Redis is empty (for testing)
    const keys = await redisClient.keys('*');
    console.log('Current Redis keys:', keys);

    if (keys.length <= 1) { // If only the test:connection key exists
      console.log('No keys found in Redis, adding sample data...');

      // Add string
      await redisClient.set('sample:string', 'Hello Redis!');
      console.log('Added sample:string');

      // Add JSON string
      await redisClient.set('sample:json', JSON.stringify({
        name: 'Redis',
        type: 'Database',
        features: ['Fast', 'In-memory', 'Versatile']
      }));
      console.log('Added sample:json');

      // Add list
      await redisClient.lPush('sample:list', ['item1', 'item2', 'item3']);
      console.log('Added sample:list');

      // Add set
      await redisClient.sAdd('sample:set', ['member1', 'member2', 'member3']);
      console.log('Added sample:set');

      // Add sorted set
      await redisClient.zAdd('sample:zset', [
        { score: 1, value: 'one' },
        { score: 2, value: 'two' },
        { score: 3, value: 'three' }
      ]);
      console.log('Added sample:zset');

      // Add hash
      await redisClient.hSet('sample:hash', {
        field1: 'value1',
        field2: 'value2',
        field3: 'value3'
      });
      console.log('Added sample:hash');

      console.log('Sample data added successfully!');
    }

    // Get Redis INFO
    const info = await redisClient.info();
    console.log('Redis INFO response (first 200 chars):', info.substring(0, 200) + '...');

    // Create a simplified stats object for easier consumption by the client
    const infoLines = info.split('\r\n');
    const parsedInfo = {};
    let currentSection = '';

    infoLines.forEach(line => {
      if (line.startsWith('# ')) {
        currentSection = line.substring(2);
        parsedInfo[currentSection] = {};
      } else if (line.includes(':') && currentSection) {
        const [key, value] = line.split(':');
        parsedInfo[currentSection][key] = value;
      }
    });

    // Add key count directly
    parsedInfo.keyCount = keys.length;

    console.log('Parsed INFO object:', JSON.stringify(parsedInfo, null, 2).substring(0, 500) + '...');

    // Send both the raw info and the parsed info
    res.json({
      info,
      parsedInfo
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});