import { useState, useEffect } from 'react';
import {
  PhoneCall,
  CheckCircle2,
  SkipForward,
  Timer,
  User,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Keyboard,
  Zap,
  Users
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

export default function StaffCounterView() {
  const { businesses, callNext, completeTicket, skipTicket } = useQueue();
  const [selectedBizId, setSelectedBizId] = useState('biz_metro');
  const [selectedDeptId, setSelectedDeptId] = useState('dept_opd');
  const [selectedCounterId, setSelectedCounterId] = useState('cnt_a1');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const biz = businesses.find(b => b.id === selectedBizId);
  const dept = biz?.departments.find(d => d.id === selectedDeptId);
  const counter = dept?.counters.find(c => c.id === selectedCounterId);

  // Currently serving ticket
  const servingTicket = dept?.servingTickets.find(t => t.counterId === selectedCounterId) || null;

  // Elapsed timer
  useEffect(() => {
    if (!servingTicket) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - servingTicket.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [servingTicket]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCallNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleComplete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedBizId, selectedDeptId, selectedCounterId]);

  const handleCallNext = () => callNext(selectedBizId, selectedDeptId, selectedCounterId);
  const handleComplete = () => completeTicket(selectedBizId, selectedDeptId, selectedCounterId);
  const handleSkip = () => skipTicket(selectedBizId, selectedDeptId, selectedCounterId);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const priorityStyles = {
    EMERGENCY: { bg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', label: 'Emergency' },
    VIP: { bg: 'bg-violet-500/15', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/30', label: 'VIP' },
    NORMAL: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20', label: 'Standard' }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 glass-panel rounded-2xl p-4 shadow-sm">
        {/* Business Selector */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-heading">{biz?.name || 'Select Business'}</p>
            <p className="text-[10px] text-brand-muted">{biz?.branch}</p>
          </div>
        </div>

        {/* Department Selector */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border shadow-sm">
          <select
            value={selectedDeptId}
            onChange={e => {
              setSelectedDeptId(e.target.value);
              const newDept = biz?.departments.find(d => d.id === e.target.value);
              if (newDept && newDept.counters.length > 0) setSelectedCounterId(newDept.counters[0].id);
            }}
            className="bg-transparent text-sm font-semibold text-brand-heading outline-none cursor-pointer"
          >
            {biz?.departments.map(d => (
              <option key={d.id} value={d.id} className="bg-brand-surface text-brand-heading">{d.name}</option>
            ))}
          </select>
        </div>

        {/* Counter Selector */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border shadow-sm">
          <select
            value={selectedCounterId}
            onChange={e => setSelectedCounterId(e.target.value)}
            className="bg-transparent text-sm font-semibold text-brand-heading outline-none cursor-pointer"
          >
            {dept?.counters.map(c => (
              <option key={c.id} value={c.id} className="bg-brand-surface text-brand-heading">{c.name}</option>
            ))}
          </select>
        </div>

        {/* Status Toggle */}
        <div className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
          counter?.status === 'SERVING'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : counter?.status === 'ONLINE'
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
            : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            counter?.status === 'SERVING' ? 'bg-emerald-500 animate-pulse' : counter?.status === 'ONLINE' ? 'bg-cyan-500' : 'bg-slate-400'
          }`} />
          {counter?.status || 'Offline'}
        </div>

        {/* Date & Time */}
        <div className="text-right hidden lg:block">
          <p className="text-xs text-brand-muted">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <p className="text-xl font-bold text-brand-heading tabular-nums">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Currently Serving - Wide Panel */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand-heading mb-4">Currently Serving</h3>

          {servingTicket ? (
            <div className="space-y-5">
              {/* Token Display */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-brand-border flex items-center justify-center">
                  <User className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-brand-muted">Token Number</p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold animate-pulse">LIVE</span>
                  </div>
                  <p className="text-4xl font-black text-brand-heading tracking-wider mt-0.5">{servingTicket.token}</p>
                  <p className="text-sm font-semibold text-brand-body mt-0.5">{servingTicket.customerName}</p>
                  <p className="text-xs text-brand-muted">{servingTicket.serviceType}</p>
                </div>
              </div>

              {/* Service Timer */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-muted" />
                  <p className="text-xs text-brand-muted">Started</p>
                  <p className="text-sm font-bold text-brand-heading">{new Date(servingTicket.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <p className="text-xs text-brand-muted">Service Time</p>
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">{formatTime(elapsedSeconds)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCallNext}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-[0.97]"
                >
                  <PhoneCall className="w-4 h-4" /> Call Next
                  <kbd className="ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono text-white">Enter</kbd>
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-[0.97]"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete
                  <kbd className="ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono text-white">Space</kbd>
                </button>
                <button
                  onClick={handleSkip}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-surface border border-brand-border text-brand-body font-semibold text-sm hover:bg-brand-bg hover:border-brand-border transition-all active:scale-[0.97]"
                >
                  <SkipForward className="w-4 h-4" /> Skip
                  <kbd className="ml-1 px-1.5 py-0.5 rounded bg-brand-bg text-[10px] font-mono text-brand-muted">Esc</kbd>
                </button>
              </div>
            </div>
          ) : (
            // Idle State
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-brand-dim" />
              </div>
              <p className="text-lg font-semibold text-brand-body">No patient being served</p>
              <p className="text-sm text-brand-muted mt-1">{dept?.waitingQueue.length || 0} in queue</p>
              <button
                onClick={handleCallNext}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <PhoneCall className="w-4 h-4" /> Call Next
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono text-white">Enter</kbd>
              </button>
            </div>
          )}
        </div>

        {/* Waiting Queue Lineup */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand-heading">Waiting Queue</h3>
            <span className="text-xs font-semibold text-brand-muted">{dept?.waitingQueue.length || 0} waiting</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {dept?.waitingQueue.length === 0 ? (
              <p className="text-sm text-brand-muted text-center py-8">Queue is empty</p>
            ) : (
              // Table header
              <>
                <div className="grid grid-cols-[60px_1fr_100px_60px] gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
                  <span>#</span>
                  <span>Customer</span>
                  <span>Type</span>
                  <span className="text-right">Wait</span>
                </div>
                {dept?.waitingQueue.map((ticket, idx) => {
                  const ps = priorityStyles[ticket.priority] || priorityStyles.NORMAL;
                  return (
                    <div
                      key={ticket.id}
                      className={`grid grid-cols-[60px_1fr_100px_60px] gap-2 items-center px-3 py-2.5 rounded-lg border transition-colors ${
                        idx === 0
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-brand-surface border-brand-border/60 hover:border-cyan-500/30'
                      }`}
                    >
                      <span className="text-sm font-bold text-brand-heading">{ticket.token}</span>
                      <span className="text-sm text-brand-body truncate">{ticket.customerName}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ps.bg} ${ps.border} ${ps.text} truncate text-center`}>
                        {ticket.priority === 'NORMAL' ? (ticket.serviceType?.split(' ').slice(0, 2).join(' ') || 'General') : ps.label}
                      </span>
                      <span className="text-xs text-brand-muted text-right">{ticket.waitMinutes || Math.round((Date.now() - ticket.createdAt) / 60000)} min</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="glass-panel rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-brand-heading">Today's Performance</h3>
          <div className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Keyboard className="w-3.5 h-3.5" />
            Keyboard shortcuts active
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            value={dept?.completedToday || 0}
            label="Customers Served"
            trend="+12%"
            trendUp={true}
            icon={<Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
          />
          <MetricCard
            value={`${dept?.avgServiceTimeMinutes || 0} min`}
            label="Avg. Service Time"
            trend="-18%"
            trendUp={false}
            icon={<Timer className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          />
          <MetricCard
            value="4.9 / 5"
            label="Satisfaction Score"
            trend="+6%"
            trendUp={true}
            icon={<Star className="w-5 h-5 text-amber-500" />}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ value, label, trend, trendUp, icon }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-surface border border-brand-border shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center shrink-0 border border-brand-border/60">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-black text-brand-heading">{value}</p>
        <p className="text-xs text-brand-muted">{label}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
          {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {trend}
        </div>
      )}
    </div>
  );
}
