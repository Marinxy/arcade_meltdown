# Arcade Meltdown - Deployment Guide

This guide explains how to deploy Arcade Meltdown for web distribution.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [Deployment Options](#deployment-options)
  - [Static Web Hosting](#static-web-hosting)
  - [Docker Container](#docker-container)
  - [Node.js Server](#nodejs-server)
- [WebRTC Considerations](#webrtc-considerations)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying Arcade Meltdown, ensure you have the following:

- Node.js (v18 or higher)
- npm or yarn
- Git (for cloning the repository)
- For Docker deployment: Docker and Docker Compose

## Building for Production

To build the game for production:

1. Clone the repository:
   ```bash
   git clone https://github.com/arcade-meltdown/arcade-meltdown.git
   cd arcade-meltdown
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the game:
   ```bash
   npm run build
   ```

4. The built files will be in the `dist` directory.

## Deployment Options

### Static Web Hosting

The simplest way to deploy Arcade Meltdown is to use static web hosting.

#### Steps:

1. Build the game as described above.
2. Upload the contents of the `dist` directory to your web server.
3. Ensure your server supports HTTPS (required for WebRTC).
4. Configure CORS headers if needed (see [WebRTC Considerations](#webrtc-considerations)).

#### Example with Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    root /path/to/dist;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CORS headers for WebRTC
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service worker
    location /sw.js {
        expires -1;
        add_header Cache-Control "no-cache";
    }
    
    # Main application
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker Container

For containerized deployment, use the provided Dockerfile.

#### Steps:

1. Build the Docker image:
   ```bash
   docker build -t arcade-meltdown .
   ```

2. Run the container:
   ```bash
   docker run -d -p 80:80 --name arcade-meltdown arcade-meltdown
   ```

3. Access the game at `http://localhost`.

#### Using Docker Compose:

1. Use the provided `docker-compose.yml` file:
   ```bash
   docker-compose up -d
   ```

2. Access the game at `http://localhost`.

### Node.js Server

For more control over the server environment, you can use a Node.js server.

#### Steps:

1. Create a server file (e.g., `server.js`):
   ```javascript
   const express = require('express');
   const path = require('path');
   const https = require('https');
   const fs = require('fs');
   
   const app = express();
   const port = process.env.PORT || 3000;
   
   // Serve static files
   app.use(express.static(path.join(__dirname, 'dist')));
   
   // CORS headers for WebRTC
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
     next();
   });
   
   // All routes serve the index.html for SPA
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });
   
   // Start server
   if (process.env.NODE_ENV === 'production') {
     // HTTPS configuration
     const options = {
       key: fs.readFileSync('/path/to/private.key'),
       cert: fs.readFileSync('/path/to/certificate.crt')
     };
     
     https.createServer(options, app).listen(port, () => {
       console.log(`Server running at https://localhost:${port}`);
     });
   } else {
     app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
     });
   }
   ```

2. Install Express:
   ```bash
   npm install express
   ```

3. Start the server:
   ```bash
   node server.js
   ```

## WebRTC Considerations

Arcade Meltdown uses WebRTC for LAN play, which has specific requirements:

### HTTPS Requirement

WebRTC requires a secure context (HTTPS) in most browsers. For local development, `localhost` is considered secure, but for production, you need:

- A valid SSL/TLS certificate
- HTTPS enabled on your server

### CORS Configuration

Cross-Origin Resource Sharing (CORS) must be properly configured to allow WebRTC connections:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
```

### STUN/TURN Servers

For WebRTC to work across different networks, you may need to configure STUN/TURN servers. These are hardcoded in the game's networking configuration:

```javascript
// In src/networking/webrtcManager.js
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
  // Add your own TURN servers here if needed
];
```

### Network Configuration

Ensure your firewall allows:
- UDP traffic on ports 3478 (STUN) and 5349 (TURN)
- TCP traffic on port 443 (for TURN over TLS)

## Troubleshooting

### Common Issues

#### WebRTC Connection Fails

1. **Check HTTPS**: Ensure your site is served over HTTPS.
2. **Check CORS**: Verify CORS headers are properly set.
3. **Check Firewall**: Ensure UDP/TCP ports are open.
4. **Check STUN/TURN**: Verify STUN/TURN servers are accessible.

#### Audio Not Playing

1. **Browser Autoplay Policy**: Modern browsers block audio until user interaction.
2. **Check Audio Files**: Ensure all audio files are correctly uploaded.
3. **Check Audio Context**: Some browsers require user interaction to create an audio context.

#### Performance Issues

1. **Enable Compression**: Use gzip or Brotli compression for static assets.
2. **Use CDN**: Serve static assets from a Content Delivery Network.
3. **Optimize Images**: Ensure images are properly optimized.
4. **Enable Caching**: Set appropriate cache headers for static assets.

### Debugging

To debug WebRTC issues:

1. Use browser developer tools to check for errors in the console.
2. Use the WebRTC internals page in Chrome: `chrome://webrtc-internals`
3. Check network traffic for failed connections.

### Testing

Before deploying to production:

1. Test the game in multiple browsers (Chrome, Firefox, Edge, Safari).
2. Test on different devices (desktop, tablet, mobile).
3. Test with multiple players on different networks.
4. Test all game features (weapons, power-ups, boss battles, etc.).