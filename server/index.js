import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createRouter } from './routes.js';
import { queueStore } from './store.js';

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend Vite dev server (port 3000) & production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);
  
  // Send initial state on connection
  socket.emit('INITIAL_STATE', {
    businesses: queueStore.businesses,
    timestamp: Date.now()
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Attach REST API routes
app.use('/api', createRouter(io));

// Health check endpoint (AWS ALB target group health check simulation)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'QueuePulse-QaaS-Core-Engine',
    awsInstanceId: 'i-09ab7612c89f112e',
    az: 'us-east-1a'
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 QueuePulse QaaS Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server listening on port ${PORT}`);
});
