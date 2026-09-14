import { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Activity,
  ArrowUpRight,
  Pill,
  Stethoscope,
  FlaskConical,
  FileText,
  Coins,
  RotateCcw,
  PlayCircle,
  Zap
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const DEPT_ICONS = {
  'Pill': Pill,
  'Stethoscope': Stethoscope,
  'FlaskConical': FlaskConical,
  'Coins': Coins,
  'FileText': FileText
};

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/30', dot: 'bg-violet-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-500' }
};

export default function AdminAnalyticsView() {
  const { businesses, metrics, openCounter, simulateSurge, resetDemo } = useQueue();
  const [surgeActive, setSurgeActive] = useState(false);
  const [recommendationDismissed, setRecommendationDismissed] = useState(false);

  // Derive department summaries from store data
  const departmentSummaries = useMemo(() => {
    if (!businesses.length) return [];
    const allDepts = [];
    businesses.forEach(biz => {
      biz.departments.forEach(dept => {
        const activeCounters = dept.counters.filter(c => c.status === 'ONLINE' || c.status === 'SERVING').length;
        const totalWaiting = dept.waitingQueue.length;
        const avgWait = dept.avgServiceTimeMinutes * Math.ceil(totalWaiting / Math.max(1, activeCounters));
        const isBusy = totalWaiting >= 3 || avgWait >= 10;

        allDepts.push({
          id: dept.id,
          name: dept.name,
          icon: dept.icon,
          color: dept.color,
          avgWait: Math.max(dept.avgServiceTimeMinutes, avgWait),
          activeCounters,
          totalCounters: dept.counters.length,
          status: isBusy ? 'Busy' : 'Normal',
          waiting: totalWaiting
        });
      });
    });
    return allDepts;
  }, [businesses]);

  const handleSimulateSurge = async () => {
    await simulateSurge();
    setSurgeActive(prev => !prev);
    setRecommendationDismissed(false);
  };

  const handleResetDemo = async () => {
    await resetDemo();
    setSurgeActive(false);
    setRecommendationDismissed(false);
  };

  const handleOpenCounter = async () => {
    await openCounter('biz_metro', 'dept_pharmacy');
    setRecommendationDismissed(true);
  };

  const recommendation = metrics?.aiRecommendation;
  const showRecommendation = recommendation && !recommendationDismissed;

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-6">
      {/* Header + Demo Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-heading">Queue Analytics</h2>
          <p className="text-sm text-brand-muted mt-0.5">Monitor queue traffic, wait times, and counter activity in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateSurge}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
              surgeActive
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            {surgeActive ? 'Stop Surge' : 'Simulate Surge'}
          </button>
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-sm font-semibold text-brand-body hover:bg-brand-bg shadow-sm transition-all active:scale-[0.97]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopMetricCard
          icon={<Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
          label="CUSTOMERS TODAY"
          value={metrics?.customersToday?.toLocaleString() || '1,420'}
          trend="+12%"
          trendUp={true}
          trendLabel="vs. yesterday"
        />
        <TopMetricCard
          icon={<Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          label="AVERAGE WAIT TIME"
          value={`${metrics?.averageWaitMinutes || '6.2'} min`}
          trend="-18%"
          trendUp={false}
          trendLabel="vs. yesterday"
        />
        <TopMetricCard
          icon={<LayoutGrid className="w-5 h-5 text-violet-600 dark:text-violet-400" />}
          label="ACTIVE COUNTERS"
          value={`${metrics?.activeCounters || 8} / ${metrics?.totalCounters || 10}`}
          sublabel="Total Counters"
        />
        <TopMetricCard
          icon={<ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          label="REDIRECTIONS SAVED"
          value={metrics?.crossBusinessRedirections || 84}
          trend="+24%"
          trendUp={true}
          trendLabel="vs. last week"
        />
      </div>

      {/* Chart + AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Arrival vs Served Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-brand-heading">Customer Arrivals vs. Served</h3>
              <p className="text-xs text-brand-muted mt-0.5">Hourly traffic during operating hours.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-brand-body">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />Arrivals</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Served</span>
            </div>
          </div>

          {/* Simple SVG Bar Chart */}
          <ArrivalChart data={metrics?.hourlyArrivalStats || []} />
        </div>

        {/* AI Recommendation Card */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-sm font-bold text-violet-600 dark:text-violet-400">AI Recommendation</p>
          </div>

          {showRecommendation ? (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-brand-heading mb-2">{recommendation.title}</h4>
                <p className="text-sm text-brand-body leading-relaxed">{recommendation.message}</p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleOpenCounter}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md transition-colors active:scale-[0.97]"
                >
                  <Zap className="w-4 h-4" /> {recommendation.actionLabel}
                </button>
                <button
                  onClick={() => setRecommendationDismissed(true)}
                  className="px-4 py-2.5 rounded-xl text-sm text-brand-muted hover:text-brand-heading hover:bg-brand-surface transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <Activity className="w-10 h-10 text-brand-dim mb-3" />
              <p className="text-sm text-brand-body font-semibold">All clear</p>
              <p className="text-xs text-brand-muted mt-1">No capacity alerts. Use "Simulate Surge" to demo AI predictions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Department Status Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-brand-heading">Department Status</h3>
            <p className="text-xs text-brand-muted">Current live queue status by department.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {departmentSummaries.map(dept => {
            const Icon = DEPT_ICONS[dept.icon] || Activity;
            const colors = COLOR_MAP[dept.color] || COLOR_MAP.cyan;
            const isBusy = dept.status === 'Busy';

            return (
              <div key={dept.id} className="glass-panel rounded-2xl p-4 hover:border-brand-border shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <p className="text-sm font-bold text-brand-heading truncate">{dept.name}</p>
                </div>
                <p className={`text-2xl font-black ${colors.text}`}>{dept.avgWait} min</p>
                <p className="text-xs text-brand-muted mt-0.5">{dept.activeCounters} counters active</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-2 h-2 rounded-full ${isBusy ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className={`text-xs font-semibold ${isBusy ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{dept.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TopMetricCard({ icon, label, value, trend, trendUp, trendLabel, sublabel }) {
  return (
    <div className="glass-panel rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center shrink-0 border border-brand-border">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">{label}</p>
        <p className="text-2xl font-black text-brand-heading mt-0.5">{value}</p>
        {sublabel && <p className="text-[10px] text-brand-dim">{sublabel}</p>}
      </div>
      {trend && (
        <div className="text-right shrink-0">
          <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
            {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend}
          </div>
          {trendLabel && <p className="text-[10px] text-brand-dim mt-0.5">{trendLabel}</p>}
        </div>
      )}
    </div>
  );
}

function ArrivalChart({ data }) {
  if (!data || data.length === 0) return <p className="text-sm text-brand-muted text-center py-10">No data</p>;

  const maxVal = Math.max(...data.map(d => Math.max(d.arrivals, d.served)), 1);
  const chartHeight = 200;
  const barWidth = 20;
  const gap = 8;
  const chartWidth = data.length * (barWidth * 2 + gap * 2 + 8);

  // Find peak period
  const peakIdx = data.reduce((pi, d, i, arr) => d.arrivals > arr[pi].arrivals ? i : pi, 0);

  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(chartWidth, 600)} height={chartHeight + 50} className="w-full" viewBox={`0 0 ${Math.max(chartWidth, 600)} ${chartHeight + 50}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <g key={i}>
            <line
              x1="40" y1={chartHeight - pct * chartHeight + 10}
              x2={Math.max(chartWidth, 600) - 10} y2={chartHeight - pct * chartHeight + 10}
              stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1"
            />
            <text
              x="35" y={chartHeight - pct * chartHeight + 14}
              fill="currentColor" className="text-slate-400 dark:text-slate-500" fontSize="10" textAnchor="end" fontFamily="monospace"
            >
              {Math.round(pct * maxVal)}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const x = 50 + i * ((barWidth * 2 + gap * 2 + 8));
          const arrH = (d.arrivals / maxVal) * chartHeight;
          const srvH = (d.served / maxVal) * chartHeight;
          const isPeak = i === peakIdx;

          return (
            <g key={i}>
              {/* Arrivals bar */}
              <rect
                x={x}
                y={chartHeight - arrH + 10}
                width={barWidth}
                height={arrH}
                rx="4"
                fill="#06B6D4"
                fillOpacity={isPeak ? 0.95 : 0.7}
              />
              {/* Served bar */}
              <rect
                x={x + barWidth + gap}
                y={chartHeight - srvH + 10}
                width={barWidth}
                height={srvH}
                rx="4"
                fill="#10B981"
                fillOpacity={isPeak ? 0.95 : 0.65}
              />
              {/* Label */}
              <text
                x={x + barWidth + gap / 2}
                y={chartHeight + 30}
                fill="currentColor"
                className="text-slate-500 dark:text-slate-400 font-medium"
                fontSize="9"
                textAnchor="middle"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {d.time}
              </text>

              {/* Peak label */}
              {isPeak && (
                <g>
                  <rect x={x - 8} y={chartHeight - arrH - 10} width={72} height={20} rx="6" className="fill-slate-900 dark:fill-slate-950 stroke-amber-500/50" strokeWidth="1" />
                  <text x={x + 28} y={chartHeight - arrH + 3} fill="#F59E0B" fontSize="9" textAnchor="middle" fontWeight="bold">
                    Peak period
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
