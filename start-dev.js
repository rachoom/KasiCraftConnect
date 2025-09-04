#!/usr/bin/env node

// Simple development server starter
// This bypasses the npm script issue and starts the TypeScript application

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Skills Connect development server...');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';

// Try to run the TypeScript server directly
const serverPath = path.join(__dirname, 'server', 'index.ts');

console.log('Attempting to start server at:', serverPath);

// Use tsx to run the TypeScript server
const server = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    // Try to avoid the vite config issue by setting different flags
    NODE_OPTIONS: '--no-warnings',
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err.message);
  console.log('Trying alternative approach...');
  
  // Fallback: try to run the simple Express app
  const fallbackServer = spawn('node', ['index.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  fallbackServer.on('error', (err) => {
    console.error('Fallback server also failed:', err.message);
    process.exit(1);
  });
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});