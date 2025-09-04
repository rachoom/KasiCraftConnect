// Simple Express server to get the application running
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Skills Connect server is running' });
});

// Serve static files from client directory if they exist
const clientDir = path.join(__dirname, 'client');
app.use(express.static(clientDir));

// Basic route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Skills Connect</title></head>
      <body>
        <h1>Skills Connect - Development Server</h1>
        <p>Server is running successfully!</p>
        <p>This is a basic development server while we resolve the configuration issues.</p>
        <ul>
          <li><a href="/api/health">Health Check</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.send(`
    <html>
      <head><title>Skills Connect</title></head>
      <body>
        <h1>Skills Connect</h1>
        <p>Route: ${req.path}</p>
        <p><a href="/">Back to Home</a></p>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Skills Connect server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});