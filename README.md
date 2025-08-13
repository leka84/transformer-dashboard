# Transformer Asset Dashboard

A modern, responsive web application for monitoring and visualizing transformer asset data in real-time. Built with Vue.js 3, TypeScript, and Chart.js.

## 🚀 Features

- **Real-time Data Visualization**: Interactive line charts showing voltage readings over time
- **Comprehensive Data Table**: Filterable table with search and sorting capabilities
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **State Management**: Persistent state across browser tabs using Pinia
- **Type Safety**: Full TypeScript support for robust development
- **Performance Optimized**: Efficient data handling and chart rendering

## 🛠️ Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Charting Library**: Chart.js with Vue Chart.js wrapper
- **Build Tool**: Vue CLI with Webpack
- **Styling**: CSS3 with modern layout techniques
- **Containerization**: Docker with Nginx

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Docker**: Version 20.10 or higher (for containerized deployment)
- **Docker Compose**: Version 2.0 or higher

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transformer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run serve:dist
   ```

## 🐳 Docker Deployment

### Quick Docker Deployment

```bash
# Build and run with Docker Compose
npm run docker:compose

# Or manually
docker-compose up -d
```

### Manual Docker Deployment

1. **Build Docker image**
   ```bash
   npm run docker:build
   ```

2. **Run container**
   ```bash
   npm run docker:run
   ```

3. **Access application**
   Navigate to `http://localhost:8080`

### Production Deployment Scripts

#### Linux/macOS
```bash
# Full deployment with build
./scripts/deploy.sh

# Production build only
./scripts/production-build.sh
```

#### Windows
```bash
# Full deployment with build
scripts\deploy.bat
```

## 📁 Project Structure

```
transformer-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── sampledata.json          # Transformer data source
├── src/
│   ├── components/
│   │   ├── TransformerTable.vue # Data table component
│   │   ├── VoltageChart.vue     # Chart visualization
│   │   └── Footer.vue           # Application footer
│   ├── stores/
│   │   └── transformer.ts       # Pinia state management
│   ├── types/
│   │   └── transformer.ts       # TypeScript interfaces
│   ├── App.vue                  # Main application component
│   └── main.ts                  # Application entry point
├── scripts/                     # Deployment and build scripts
├── Dockerfile                   # Docker container configuration
├── docker-compose.yml           # Docker Compose configuration
├── nginx.conf                   # Nginx server configuration
└── package.json                 # Project dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
VUE_APP_API_URL=your-api-url
VUE_APP_CHART_ANIMATION=true
```

### TypeScript Configuration

The project uses `tsconfig.json` with strict type checking enabled:

- Target: ES2020
- Module: ES2020
- Strict mode enabled
- Decorator support enabled

### ESLint Configuration

ESLint is configured with Vue.js and TypeScript rules:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## 📊 Data Format

The application expects transformer data in the following JSON format:

```json
[
  {
    "assetId": 1,
    "name": "Transformer Alpha",
    "region": "London",
    "health": "Good",
    "lastTenVoltgageReadings": [
      {
        "timestamp": "2024-07-21T00:00:00Z",
        "voltage": "35234"
      }
    ]
  }
]
```

## 🧪 Testing

### Code Quality Checks

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run all checks
npm run test
```

### Build Verification

```bash
# Production build with integrity check
./scripts/production-build.sh
```

## 🚀 Deployment

### Local Development

```bash
npm run serve
```

### Production Build

```bash
npm run build
```

### Docker Deployment

```bash
# Full deployment
npm run deploy

# Windows deployment
npm run deploy:win
```

### Manual Server Deployment

1. Build the application: `npm run build`
2. Copy `dist/` folder to your web server
3. Configure your web server to serve the SPA
4. Ensure all routes redirect to `index.html`

## 📈 Performance

- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Chart Rendering**: Efficient Chart.js configuration with debounced updates
- **State Management**: Reactive updates with minimal re-renders
- **Asset Optimization**: Gzip compression and long-term caching

## 🔒 Security

- **Content Security Policy**: Configured in nginx.conf
- **XSS Protection**: Enabled headers
- **Frame Options**: Same-origin policy
- **HTTPS Ready**: Configured for secure deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Updates

### Version 0.1.0
- Initial release with core functionality
- Transformer data visualization
- Responsive design
- Docker deployment support
- TypeScript integration
- State management with Pinia

---

**Built with ❤️ using Vue.js 3, TypeScript, and Chart.js**
