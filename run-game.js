/**
 * Arcade Meltdown - Game Runner
 * Simple script to run the game
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = 8080;
const PUBLIC_DIR = __dirname;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Parse URL
  let filePath = req.url;
  if (filePath === '/' || filePath === '') {
    filePath = '/index.html';
  }
  
  // Build full file path
  filePath = path.join(PUBLIC_DIR, filePath);
  
  // Get file extension
  const extname = path.extname(filePath);
  
  // Set default Content-Type
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.log(`File not found: ${filePath}`);
        
        // Check if it's a module import
        if (filePath.endsWith('.js')) {
          // Try to find the file with .js extension
          const jsPath = filePath + '.js';
          fs.readFile(jsPath, (jsErr, jsContent) => {
            if (jsErr) {
              // File not found
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('<html><body><h1>404 Not Found</h1><p>File not found</p></body></html>');
            } else {
              // File found
              res.writeHead(200, { 'Content-Type': 'text/javascript' });
              res.end(jsContent, 'utf-8');
            }
          });
        } else {
          // File not found
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<html><body><h1>404 Not Found</h1><p>File not found</p></body></html>');
        }
      } else {
        // Server error
        console.error(`Server error: ${err.code}`);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>500 Internal Server Error</h1><p>Something went wrong</p></body></html>');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
  console.log('');
  console.log('Game Controls:');
  console.log('  WASD - Move your character');
  console.log('  Mouse - Aim');
  console.log('  Left Mouse Button - Shoot');
  console.log('  Right Mouse Button - Secondary Fire (if available)');
  console.log('  1-5 - Switch weapons');
  console.log('  Q/E - Use power-ups');
  console.log('  ESC - Pause game');
  console.log('');
  console.log('Open your browser and navigate to http://localhost:' + PORT + ' to play the game!');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nServer stopped');
  process.exit(0);
});