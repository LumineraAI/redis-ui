# Redis Visualizer: Modern UI Dashboard for Redis Database Management

[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A powerful, intuitive, and beautiful web interface for Redis database management, monitoring, and data visualization. Built with React, Material UI, Node.js, and Express.

![Redis Visualizer Dashboard](https://redis.io/images/redis-white.png)

## ✨ Key Features

- **Real-time Dashboard**: Comprehensive overview of Redis server performance metrics, memory usage, and recent keys
- **Interactive Key Explorer**: Efficiently browse, search, and filter through all Redis keys with pagination support
- **Advanced Data Visualization**: Rich visualization for all Redis data types:
  - Strings (with JSON detection and formatting)
  - Lists
  - Sets
  - Sorted Sets (ZSets)
  - Hashes
- **Detailed Performance Monitoring**: Server statistics with interactive charts and graphs
- **Modern, Responsive UI**: Clean interface that works on desktop and mobile devices

## 📋 Prerequisites

- **Node.js**: v14.0.0 or higher
- **npm** or **yarn**: Latest stable version recommended
- **Redis server**: Running instance (local or remote)
- **Web browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## 🚀 Quick Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/redis-visualizer.git
cd redis-visualizer
```

2. **Install dependencies** (server and client):
```bash
# Install server dependencies
npm install

# Install client dependencies
npm run install-client
```

3. **Configure Redis connection**:
Create a `.env` file in the root directory:
```
REDIS_URL=redis://localhost:6379
PORT=5001
```

4. **Start the application**:
```bash
npm run dev
```

## 🔧 Detailed Installation Guide

### Handling Dependency Issues

If you encounter dependency conflicts during installation, try one of these solutions:

```bash
# Solution 1: Use legacy-peer-deps flag
cd client && npm install --legacy-peer-deps

# Solution 2: Use force flag with legacy-peer-deps
cd client && npm install --legacy-peer-deps --force

# Solution 3: Clean install (recommended for persistent issues)
cd client && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps
```

Or use our provided script:
```bash
npm run reinstall-client
```

### Docker Installation (Alternative)

For containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t redis-visualizer .
docker run -p 5001:5001 -e REDIS_URL=redis://your-redis-host:6379 redis-visualizer
```

## 🖥️ Running the Application

### Development Environment

```bash
# Run both server and client concurrently (recommended)
npm run dev

# Or run them separately
npm run server  # Starts the Node.js backend with hot-reloading
npm run client  # Starts the React development server
```

### Production Deployment

```bash
# Build optimized client assets
npm run build

# Start production server
npm start
```

## 📊 Features & Usage Guide

Once the application is running, open your browser and navigate to:

```
http://localhost:3000
```

### 1. Dashboard

![Dashboard Screenshot](https://redis.io/images/redis-white.png)

The real-time dashboard provides a comprehensive overview of your Redis instance:

- **Key Metrics**:
  - Total number of keys in database
  - Memory usage with visual indicators
  - Connected clients count
  - Server uptime statistics

- **Quick Access**:
  - Recent keys with type indicators
  - One-click navigation to detailed views

- **Server Information**:
  - Redis version and configuration
  - Operating system details
  - Process information

### 2. Key Explorer

The powerful key management interface allows you to:

- **Search & Filter**: Quickly find keys using the search functionality
- **Type Identification**: Visual indicators show key types (string, list, hash, etc.)
- **Efficient Navigation**: Paginated results for handling large datasets
- **Sorting Options**: Organize keys by name, type, or size

### 3. Key Details & Data Visualization

Comprehensive key inspection with:

- **Metadata Display**:
  - Key type information
  - TTL (Time To Live) with expiration countdown
  - Size and memory usage

- **Type-Specific Visualizations**:
  - **Strings**: Text display with automatic JSON detection and formatting
  - **Lists**: Ordered item display with pagination
  - **Sets**: Member visualization with cardinality information
  - **Sorted Sets**: Score-based visualization with ranking
  - **Hashes**: Field-value pair display with interactive exploration

### 4. Performance Monitoring

Detailed Redis server statistics with:

- **Interactive Charts**:
  - Memory usage trends
  - Command execution metrics
  - Hit/miss ratio visualization

- **System Information**:
  - CPU and memory allocation
  - Network statistics
  - Persistence configuration

## 🔄 Integration Options

Redis Visualizer can be integrated with:

- **CI/CD Pipelines**: Automated deployment scripts included
- **Monitoring Systems**: Prometheus-compatible metrics
- **Authentication Systems**: Support for Redis ACL and password authentication
- **Custom Redis Implementations**: Compatible with Redis, Redis Cluster, and Redis Sentinel

## 🛠️ Technology Stack

Redis Visualizer is built with modern, production-ready technologies:

- **Frontend**:
  - [React](https://reactjs.org/) - Component-based UI library
  - [Material UI](https://mui.com/) - React component library implementing Google's Material Design
  - [Chart.js](https://www.chartjs.org/) - Interactive data visualization
  - [Axios](https://axios-http.com/) - Promise-based HTTP client

- **Backend**:
  - [Node.js](https://nodejs.org/) - JavaScript runtime
  - [Express](https://expressjs.com/) - Web application framework
  - [node-redis](https://github.com/redis/node-redis) - Redis client for Node.js

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 Roadmap

Upcoming features and improvements:

- [ ] Redis Cluster support
- [ ] User authentication and access control
- [ ] Advanced key filtering and sorting
- [ ] Export/import functionality
- [ ] Dark mode theme
- [ ] Mobile app version

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Redis](https://redis.io/) - The open-source, in-memory data store
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Material UI](https://mui.com/) - React components for faster and easier web development
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine

---

<p align="center">
  <b>Redis Visualizer</b> - The modern Redis management dashboard<br>
  <a href="https://github.com/yourusername/redis-visualizer">GitHub</a> •
  <a href="https://github.com/yourusername/redis-visualizer/issues">Report Bug</a> •
  <a href="https://github.com/yourusername/redis-visualizer/issues">Request Feature</a>
</p>