import { useState, useEffect } from 'react';
import {
  QrCode,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Ticket,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Navigation,
  X,
  Pill,
  Stethoscope,
  FlaskConical,
  Coins,
  Plus,
  Sparkles,
  Bell
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const DEPT_ICONS = {
  'Pill': Pill,
  'Stethoscope': Stethoscope,
  'FlaskConical': FlaskConical,
  'Coins': Coins,
  'FileText': Ticket
};

const STATUS_CONFIG = {
  WAITING: {
    label: "You're in line",
    dotColor: 'bg-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-600 dark:text-cyan-400'
  },
  SERVING: {
    label: 'Proceed Now!',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-600 dark:text-emerald-400'
  }
};

export default function CustomerWalletView() {
  const { userTickets, fetchUserWallet, rerouteTicket, joinQueue, businesses } = useQueue();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [rerouteAlert, setRerouteAlert] = useState(null);
  const [dismissedReroutes, setDismissedReroutes] = useState(new Set());

  useEffect(() => {
    fetchUserWallet();
    const interval = setInterval(() => fetchUserWallet(), 3000);
    return () => clearInterval(interval);
  }, [fetchUserWallet]);

  // Check for smart redirection opportunities
  useEffect(() => {
    const longWait = userTickets.find(t => t.status === 'WAITING' && t.estimatedWaitMinutes > 10 && t.partnerBranch && !dismissedReroutes.has(t.id));
    if (longWait) {
      setRerouteAlert({
        ticket: longWait,
        branch: longWait.partnerBranch
      });
    } else {
      setRerouteAlert(null);
    }
  }, [userTickets, dismissedReroutes]);

  const handleReroute = async () => {
    if (!rerouteAlert) return;
    await rerouteTicket(rerouteAlert.ticket.id, rerouteAlert.branch.id);
    setRerouteAlert(null);
  };

  const handleDismissReroute = () => {
    if (rerouteAlert) {
      setDismissedReroutes(prev => new Set(prev).add(rerouteAlert.ticket.id));
    }
    setRerouteAlert(null);
  };

  const activeCount = userTickets.filter(t => t.status === 'WAITING' || t.status === 'SERVING').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-1">Smart Queues. Happier People.</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-heading">
            Your Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">Matters</span>
          </h2>
          <p className="text-brand-muted mt-1">Join, track and manage your queues across all businesses in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm">
            <Ticket className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-brand-heading">{activeCount}</span>
            <span className="text-brand-muted">Active</span>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Join Queue
          </button>
        </div>
      </div>

      {/* Smart Redirection Alert */}
      {rerouteAlert && (
        <div className="glass-panel rounded-2xl p-5 border-amber-500/40 bg-amber-500/5 animate-in">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Smart Redirection Available</p>
              </div>
              <p className="text-sm text-brand-body">
                High congestion at <span className="text-brand-heading font-semibold">{rerouteAlert.ticket.businessName}</span> ({rerouteAlert.ticket.estimatedWaitMinutes} min wait).{' '}
                <span className="text-brand-heading font-semibold">{rerouteAlert.branch.name}</span> is {rerouteAlert.branch.distance} away with only {rerouteAlert.branch.currentAvgWait} wait.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handleReroute}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-colors"
                >
                  <ArrowRight className="w-4 h-4" /> Switch Queue
                </button>
                <button onClick={handleDismissReroute} className="px-4 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-heading hover:bg-brand-surface transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Queue Cards */}
      <div className="space-y-4">
        {userTickets.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <QrCode className="w-12 h-12 text-brand-dim mx-auto mb-4" />
            <p className="text-lg font-semibold text-brand-muted">No active queues</p>
            <p className="text-sm text-brand-dim mt-1">Scan a QR code or join a queue to get started</p>
          </div>
        ) : (
          userTickets.map(ticket => {
            const config = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.WAITING;
            const isServing = ticket.status === 'SERVING';

            return (
              <div
                key={ticket.id}
                className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
                  isServing ? 'ring-2 ring-emerald-500/50 animate-glow' : ''
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${isServing ? 'bg-emerald-500/15' : 'bg-cyan-500/10'} flex items-center justify-center`}>
                      <Stethoscope className={`w-5 h-5 ${isServing ? 'text-emerald-500' : 'text-cyan-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-heading">{ticket.businessName}</p>
                      <p className="text-xs text-brand-muted">{ticket.departmentName}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.borderColor} border ${config.textColor}`}>
                    <span className={`w-2 h-2 rounded-full ${config.dotColor} ${isServing ? 'animate-pulse' : ''}`} />
                    {config.label}
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 pb-5">
                  {isServing ? (
                    // SERVING STATE — Urgent alert
                    <div className="mt-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 glow-emerald tracking-wide">{ticket.token}</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold mt-1">Proceed to {ticket.counterName || 'Counter 01'}</p>
                    </div>
                  ) : (
                    // WAITING STATE — Progress display
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="text-center p-3 rounded-xl bg-brand-bg/60 border border-brand-border/60">
                        <p className="text-xs text-brand-muted mb-1">Your Token</p>
                        <p className="text-2xl font-black text-brand-heading tracking-wide">{ticket.token}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-brand-bg/60 border border-brand-border/60">
                        <p className="text-xs text-brand-muted mb-1">Position</p>
                        <p className="text-2xl font-black text-cyan-500">{ticket.positionInQueue}</p>
                        <p className="text-[10px] text-brand-muted">Ahead</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-brand-bg/60 border border-brand-border/60">
                        <p className="text-xs text-brand-muted mb-1">Est. Wait</p>
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4 text-cyan-500" />
                          <p className="text-2xl font-black text-brand-heading">~{ticket.estimatedWaitMinutes}</p>
                        </div>
                        <p className="text-[10px] text-brand-muted">min</p>
                      </div>
                    </div>
                  )}

                  {/* Notification Message */}
                  {!isServing && (
                    <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-brand-bg/40 border border-brand-border">
                      <Bell className="w-4 h-4 text-cyan-500 shrink-0" />
                      <p className="text-xs text-brand-muted">
                        You'll be notified when it's your turn. Now serving: <span className="text-brand-heading font-semibold">{ticket.nowServingToken}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Join Queue Modal */}
      {showJoinModal && (
        <JoinQueueModal
          businesses={businesses}
          onJoin={async (bizId, deptId, serviceType) => {
            await joinQueue(bizId, deptId, 'Alex Morgan', serviceType, 'NORMAL');
            setShowJoinModal(false);
          }}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </div>
  );
}

function JoinQueueModal({ businesses, onJoin, onClose }) {
  const [selectedBiz, setSelectedBiz] = useState(null);

  const biz = businesses.find(b => b.id === selectedBiz);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md glass-panel rounded-2xl overflow-hidden shadow-2xl border border-brand-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-brand-border bg-brand-surface">
          <h3 className="text-lg font-bold text-brand-heading">Join a New Queue</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-bg text-brand-muted hover:text-brand-heading transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {!selectedBiz ? (
            // Step 1: Select Business
            <>
              <p className="text-sm text-brand-muted mb-3">Select a business to get started.</p>
              {businesses.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBiz(b.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl glass-panel-interactive text-left"
                >
                  <div>
                    <p className="text-sm font-bold text-brand-heading">{b.name}</p>
                    <p className="text-xs text-brand-muted">{b.category} · {b.branch}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </button>
              ))}
            </>
          ) : (
            // Step 2: Select Department / Service
            <>
              <button onClick={() => setSelectedBiz(null)} className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline mb-2 block">&larr; Back to businesses</button>
              <p className="text-sm text-brand-muted mb-3">Select a service at <span className="text-brand-heading font-semibold">{biz?.name}</span>.</p>
              {biz?.departments.map(dept => {
                const Icon = DEPT_ICONS[dept.icon] || Ticket;
                const waitingCount = dept.waitingQueue.length;
                const activeCounters = dept.counters.filter(c => c.status === 'ONLINE' || c.status === 'SERVING').length;

                return (
                  <button
                    key={dept.id}
                    onClick={() => onJoin(selectedBiz, dept.id, dept.name)}
                    className="w-full flex items-center justify-between p-4 rounded-xl glass-panel-interactive text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-heading">{dept.name}</p>
                        <p className="text-xs text-brand-muted">{waitingCount} waiting · {activeCounters} counters active</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-muted" />
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
