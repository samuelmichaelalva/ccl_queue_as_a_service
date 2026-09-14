import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const QueueContext = createContext(null);

const API_BASE = '/api';

export function QueueProvider({ children }) {
  const [businesses, setBusinesses] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const socketRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[QueuePulse] WebSocket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('INITIAL_STATE', (data) => {
      setBusinesses(data.businesses || []);
    });

    socket.on('QUEUE_STATE_CHANGED', (data) => {
      setBusinesses(data.businesses || []);
      setMetrics(data.metrics || null);
      setLastEvent({ type: data.type, timestamp: data.timestamp });
    });

    // Initial REST fetch
    fetchState();
    fetchUserWallet();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/state`);
      const data = await res.json();
      setBusinesses(data.businesses || []);
      setMetrics(data.metrics || null);
    } catch (err) {
      console.error('Failed to fetch state', err);
    }
  }, []);

  const fetchUserWallet = useCallback(async (userId = 'guest_alex') => {
    try {
      const res = await fetch(`${API_BASE}/user-wallet?userId=${userId}`);
      const data = await res.json();
      setUserTickets(data.tickets || []);
    } catch (err) {
      console.error('Failed to fetch wallet', err);
    }
  }, []);

  // Action helpers
  const apiPost = useCallback(async (endpoint, body = {}) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      // Refresh wallet after any action
      setTimeout(() => fetchUserWallet(), 300);
      return data;
    } catch (err) {
      console.error(`API Error ${endpoint}:`, err);
      return { error: err.message };
    }
  }, [fetchUserWallet]);

  const callNext = (bizId, deptId, counterId) => apiPost('/counter/call-next', { businessId: bizId, departmentId: deptId, counterId });
  const completeTicket = (bizId, deptId, counterId) => apiPost('/counter/complete', { businessId: bizId, departmentId: deptId, counterId });
  const skipTicket = (bizId, deptId, counterId) => apiPost('/counter/skip', { businessId: bizId, departmentId: deptId, counterId });
  const joinQueue = (bizId, deptId, customerName, serviceType, priority) => apiPost('/tickets/join', { businessId: bizId, departmentId: deptId, customerName, serviceType, priority });
  const openCounter = (bizId, deptId) => apiPost('/ai/open-counter', { businessId: bizId, departmentId: deptId });
  const rerouteTicket = (ticketId, branchId) => apiPost('/ai/reroute-ticket', { ticketId, targetBranchId: branchId });
  const simulateSurge = () => apiPost('/demo/simulate-surge');
  const resetDemo = () => apiPost('/demo/reset');
  const generateLambdaReport = () => apiPost('/aws/lambda-report');

  const value = {
    businesses,
    metrics,
    userTickets,
    connected,
    lastEvent,
    fetchState,
    fetchUserWallet,
    callNext,
    completeTicket,
    skipTicket,
    joinQueue,
    openCounter,
    rerouteTicket,
    simulateSurge,
    resetDemo,
    generateLambdaReport
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}
