# Redis Visualizer

A beautiful UI for visualizing Redis data with a modern React frontend and Node.js backend.

![Redis Visualizer](https://redis.io/images/redis-white.png)

## Features

- **Dashboard**: Overview of Redis server stats and recent keys
- **Key Explorer**: Browse and search through all Redis keys
- **Data Visualization**: Visualize different Redis data types (strings, lists, sets, sorted sets, hashes)
- **Server Stats**: Detailed Redis server statistics with charts

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Redis server (local or remote)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/redis-visualizer.git
cd redis-visualizer
```

2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
npm run install-client
```

   > **Note:** If you encounter dependency conflicts, you can use one of these approaches:
   > ```bash
   > # Option 1: Use legacy-peer-deps flag
   > cd client && npm install --legacy-peer-deps
   >
   > # Option 2: Use force flag with legacy-peer-deps
   > cd client && npm install --legacy-peer-deps --force
   >
   > # Option 3: Clean install (recommended if you have issues)
   > cd client && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps
   > ```
   >
   > Or use the provided script:
   > ```bash
   > npm run reinstall-client
   > ```

4. Create a `.env` file in the root directory with your Redis connection details:
```
REDIS_URL=redis://localhost:6379
PORT=5000
```

## Running the Application

### Development Mode

Run both the server and client in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Run the server
npm run server

# Run the client
npm run client
```

### Production Mode

Build the client and start the server:

```bash
npm run build
npm start
```

## Usage

Once the application is running, open your browser and navigate to:

```
http://localhost:3000
```

### Dashboard

The dashboard provides an overview of your Redis instance, including:
- Total number of keys
- Memory usage
- Connected clients
- Uptime
- Recent keys
- Server information

### Key Explorer

Browse and search through all keys in your Redis database:
- Search keys by name
- View key types with color-coded icons
- Paginated results for better performance

### Key Details

View detailed information about a specific key:
- Key type
- TTL (Time To Live)
- Value visualization based on data type

### Stats

View detailed Redis server statistics:
- Memory usage charts
- Command statistics
- Detailed server information

## License

MIT