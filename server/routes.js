import express from 'express';
import { queueStore } from './store.js';
import { AIEngine } from './aiEngine.js';

export function createRouter(io) {
  const router = express.Router();

  // Helper to broadcast state changes
  const broadcastSync = (eventType = 'SYNC_ALL') => {
    io.emit('QUEUE_STATE_CHANGED', {
      type: eventType,
      businesses: queueStore.businesses,
      metrics: getAggregatedMetrics(),
      timestamp: Date.now()
    });
  };

  const getAggregatedMetrics = () => {
    const metro = queueStore.getBusiness('biz_metro');
    const pharmacy = metro ? metro.departments.find(d => d.id === 'dept_pharmacy') : null;
    const aiAnalysis = pharmacy ? AIEngine.analyzeDepartmentCapacity(pharmacy) : null;

    let totalActiveCounters = 0;
    let totalTotalCounters = 0;
    let totalWaitingCustomers = 0;

    queueStore.businesses.forEach(b => {
      b.departments.forEach(d => {
        totalTotalCounters += d.counters.length;
        totalActiveCounters += d.counters.filter(c => c.status === 'ONLINE' || c.status === 'SERVING').length;
        totalWaitingCustomers += d.waitingQueue.length;
      });
    });

    return {
      customersToday: queueStore.totalCustomersToday,
      averageWaitMinutes: 6.2,
      activeCounters: totalActiveCounters,
      totalCounters: totalTotalCounters,
      waitingCustomers: totalWaitingCustomers,
      crossBusinessRedirections: queueStore.crossBusinessRedirectionsCount,
      aiRecommendation: aiAnalysis ? aiAnalysis.recommendation : null,
      hourlyArrivalStats: queueStore.hourlyArrivalStats,
      isSimulatedSurge: queueStore.activeSimulatedSurge
    };
  };

  // Get full state
  router.get('/state', (req, res) => {
    res.json({
      businesses: queueStore.businesses,
      metrics: getAggregatedMetrics()
    });
  });

  // Get User's Active Tickets (Universal Wallet)
  router.get('/user-wallet', (req, res) => {
    const userId = req.query.userId || 'guest_alex';
    const tickets = queueStore.getAllActiveTicketsForUser(userId);
    res.json({ tickets });
  });

  // Join Queue
  router.post('/tickets/join', (req, res) => {
    try {
      const { businessId, departmentId, customerName, serviceType, priority, userId } = req.body;
      const ticket = queueStore.joinQueue(businessId, departmentId, customerName || 'Alex Morgan', serviceType, priority || 'NORMAL', userId || 'guest_alex');
      
      broadcastSync('TICKET_JOINED');
      res.status(201).json({ success: true, ticket });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Counter Staff: Call Next
  router.post('/counter/call-next', (req, res) => {
    try {
      const { businessId, departmentId, counterId } = req.body;
      const result = queueStore.callNext(businessId, departmentId, counterId);
      
      broadcastSync('TICKET_CALLED');
      res.json({ success: true, servingTicket: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Counter Staff: Complete
  router.post('/counter/complete', (req, res) => {
    try {
      const { businessId, departmentId, counterId } = req.body;
      const ticketId = queueStore.completeTicket(businessId, departmentId, counterId);
      
      broadcastSync('TICKET_COMPLETED');
      res.json({ success: true, completedTicketId: ticketId });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Counter Staff: Skip
  router.post('/counter/skip', (req, res) => {
    try {
      const { businessId, departmentId, counterId } = req.body;
      const ticketId = queueStore.skipTicket(businessId, departmentId, counterId);
      
      broadcastSync('TICKET_SKIPPED');
      res.json({ success: true, skippedTicketId: ticketId });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // AI: Open Recommended Counter
  router.post('/ai/open-counter', (req, res) => {
    try {
      const { businessId, departmentId } = req.body;
      const counter = queueStore.openRecommendedCounter(businessId || 'biz_metro', departmentId || 'dept_pharmacy');
      
      broadcastSync('COUNTER_OPENED');
      res.json({ success: true, counter });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // AI: Reroute / Switch Queue to Partner Branch
  router.post('/ai/reroute-ticket', (req, res) => {
    try {
      const { ticketId, targetBranchId } = req.body;
      const result = queueStore.rerouteTicket(ticketId, targetBranchId);
      
      broadcastSync('TICKET_REROUTED');
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Demo: Toggle Simulated Surge
  router.post('/demo/simulate-surge', (req, res) => {
    const isSurge = queueStore.toggleSimulateSurge();
    broadcastSync('SIMULATION_TOGGLED');
    res.json({ success: true, isSurge });
  });

  // Demo: Reset Store
  router.post('/demo/reset', (req, res) => {
    queueStore.reset();
    broadcastSync('STORE_RESET');
    res.json({ success: true, message: 'Store reset to initial state' });
  });

  // AWS V7 Serverless Lambda Execution Simulation
  router.post('/aws/lambda-report', (req, res) => {
    const report = AIEngine.generateLambdaDailyReport(queueStore);
    res.json(report);
  });

  return router;
}
