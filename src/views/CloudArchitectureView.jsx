import { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  PlayCircle,
  Activity,
  Loader2,
  Zap
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const ARCH_VERSIONS = [
  {
    version: 'V1',
    title: 'S3 Static Hosting',
    description: 'Static customer portal & landing page hosted on Amazon S3 with CloudFront CDN for global low-latency delivery.',
    awsServices: ['Amazon S3', 'CloudFront'],
    color: 'cyan',
    nodes: [
      { label: 'CloudFront CDN', type: 'cdn', x: 100, y: 60 },
      { label: 'S3 Bucket (Static Web)', type: 'storage', x: 350, y: 60 },
      { label: 'End Users', type: 'user', x: 100, y: 200 }
    ],
    connections: [
      { from: 2, to: 0, label: 'HTTPS' },
      { from: 0, to: 1, label: 'Origin Fetch' }
    ]
  },
  {
    version: 'V2',
    title: 'Dynamic EC2 Monolith',
    description: 'Full dynamic queue engine deployed on Amazon EC2 with embedded database for real-time ticket operations and WebSocket streaming.',
    awsServices: ['Amazon EC2', 'Node.js Runtime', 'SQLite/Embedded DB'],
    color: 'emerald',
    nodes: [
      { label: 'End Users', type: 'user', x: 100, y: 200 },
      { label: 'EC2 Instance', type: 'compute', x: 350, y: 120 },
      { label: 'Queue Engine + DB', type: 'app', x: 350, y: 240 }
    ],
    connections: [
      { from: 0, to: 1, label: 'HTTP / WS' },
      { from: 1, to: 2, label: 'Internal' }
    ]
  },
  {
    version: 'V3',
    title: 'Decoupled RDS Layer',
    description: 'Database migrated to Amazon RDS PostgreSQL in a private subnet. Separates compute and data tiers for improved security and reliability.',
    awsServices: ['Amazon EC2 (Public)', 'Amazon RDS PostgreSQL (Private)', 'Security Groups'],
    color: 'violet',
    nodes: [
      { label: 'End Users', type: 'user', x: 60, y: 140 },
      { label: 'EC2 Web Server', type: 'compute', x: 250, y: 80 },
      { label: 'RDS PostgreSQL', type: 'database', x: 480, y: 80 },
      { label: 'Public Subnet', type: 'zone', x: 250, y: 200 },
      { label: 'Private Subnet', type: 'zone', x: 480, y: 200 }
    ],
    connections: [
      { from: 0, to: 1, label: 'HTTPS' },
      { from: 1, to: 2, label: 'TCP 5432' }
    ]
  },
  {
    version: 'V4',
    title: 'VPC & Network Security',
    description: 'Amazon VPC with custom CIDR, public/private subnets, NAT Gateway, and Security Groups hardening all network boundaries.',
    awsServices: ['Amazon VPC', 'Public Subnets', 'Private Subnets', 'NAT Gateway', 'Internet Gateway', 'Security Groups'],
    color: 'amber',
    nodes: [
      { label: 'Internet Gateway', type: 'gateway', x: 100, y: 50 },
      { label: 'NAT Gateway', type: 'gateway', x: 350, y: 50 },
      { label: 'EC2 (Public Subnet)', type: 'compute', x: 100, y: 160 },
      { label: 'RDS (Private Subnet)', type: 'database', x: 350, y: 160 },
      { label: 'Security Groups', type: 'shield', x: 230, y: 260 }
    ],
    connections: [
      { from: 0, to: 2, label: 'Inbound' },
      { from: 2, to: 3, label: 'Allowed' },
      { from: 1, to: 3, label: 'Outbound' }
    ]
  },
  {
    version: 'V5',
    title: 'Multi-AZ & Auto Scaling',
    description: 'Application Load Balancer distributes traffic across Auto Scaling Group with EC2 instances in two Availability Zones. Multi-AZ RDS for failover.',
    awsServices: ['ALB', 'Auto Scaling Group', 'EC2 (AZ-1a)', 'EC2 (AZ-1b)', 'RDS Multi-AZ'],
    color: 'cyan',
    nodes: [
      { label: 'Application Load Balancer', type: 'balancer', x: 260, y: 40 },
      { label: 'EC2 (AZ us-east-1a)', type: 'compute', x: 120, y: 150 },
      { label: 'EC2 (AZ us-east-1b)', type: 'compute', x: 400, y: 150 },
      { label: 'RDS Primary (AZ-1a)', type: 'database', x: 120, y: 260 },
      { label: 'RDS Standby (AZ-1b)', type: 'database', x: 400, y: 260 }
    ],
    connections: [
      { from: 0, to: 1, label: 'Route' },
      { from: 0, to: 2, label: 'Route' },
      { from: 1, to: 3, label: 'Read/Write' },
      { from: 3, to: 4, label: 'Sync Replication' }
    ]
  },
  {
    version: 'V6',
    title: 'Infrastructure as Code',
    description: 'Complete AWS CloudFormation template to deploy the entire VPC, ALB, ASG, and RDS stack consistently across any AWS Region.',
    awsServices: ['AWS CloudFormation', 'Template Stack', 'Cross-Region Deploy'],
    color: 'emerald',
    nodes: [
      { label: 'CloudFormation Template', type: 'iac', x: 260, y: 50 },
      { label: 'Stack: us-east-1', type: 'stack', x: 120, y: 170 },
      { label: 'Stack: ap-south-1', type: 'stack', x: 400, y: 170 },
      { label: 'VPC + ALB + ASG + RDS', type: 'infra', x: 120, y: 270 },
      { label: 'VPC + ALB + ASG + RDS', type: 'infra', x: 400, y: 270 }
    ],
    connections: [
      { from: 0, to: 1, label: 'Deploy' },
      { from: 0, to: 2, label: 'Deploy' },
      { from: 1, to: 3, label: 'Creates' },
      { from: 2, to: 4, label: 'Creates' }
    ]
  },
  {
    version: 'V7',
    title: 'Serverless Lambda Reports',
    description: 'AWS Lambda functions triggered by Amazon EventBridge to generate daily analytics reports from the RDS database, reducing operational overhead.',
    awsServices: ['AWS Lambda', 'Amazon EventBridge', 'Amazon RDS', 'S3 Report Bucket'],
    color: 'violet',
    nodes: [
      { label: 'EventBridge (Cron)', type: 'event', x: 80, y: 60 },
      { label: 'AWS Lambda', type: 'lambda', x: 280, y: 60 },
      { label: 'RDS PostgreSQL', type: 'database', x: 280, y: 200 },
      { label: 'S3 Report Bucket', type: 'storage', x: 480, y: 60 }
    ],
    connections: [
      { from: 0, to: 1, label: 'Trigger' },
      { from: 1, to: 2, label: 'Query' },
      { from: 1, to: 3, label: 'Store Report' }
    ]
  }
];

const NODE_STYLES = {
  user: { bg: 'fill-slate-100 dark:fill-slate-800', stroke: '#64748B', icon: '👤', text: '#334155' },
  cdn: { bg: 'fill-cyan-50 dark:fill-cyan-950', stroke: '#06B6D4', icon: '🌐', text: '#0891B2' },
  storage: { bg: 'fill-emerald-50 dark:fill-emerald-950', stroke: '#10B981', icon: '📦', text: '#059669' },
  compute: { bg: 'fill-blue-50 dark:fill-blue-950', stroke: '#3B82F6', icon: '🖥️', text: '#2563EB' },
  app: { bg: 'fill-violet-50 dark:fill-violet-950', stroke: '#8B5CF6', icon: '⚙️', text: '#7C3AED' },
  database: { bg: 'fill-amber-50 dark:fill-amber-950', stroke: '#F59E0B', icon: '🗄️', text: '#D97706' },
  zone: { bg: 'fill-slate-100 dark:fill-slate-900', stroke: '#94A3B8', icon: '🔲', text: '#64748B' },
  gateway: { bg: 'fill-cyan-50 dark:fill-cyan-950', stroke: '#06B6D4', icon: '🚪', text: '#0891B2' },
  shield: { bg: 'fill-rose-50 dark:fill-rose-950', stroke: '#F43F5E', icon: '🛡️', text: '#E11D48' },
  balancer: { bg: 'fill-cyan-50 dark:fill-cyan-950', stroke: '#06B6D4', icon: '⚖️', text: '#0891B2' },
  iac: { bg: 'fill-emerald-50 dark:fill-emerald-950', stroke: '#10B981', icon: '📄', text: '#059669' },
  stack: { bg: 'fill-blue-50 dark:fill-blue-950', stroke: '#3B82F6', icon: '📚', text: '#2563EB' },
  infra: { bg: 'fill-slate-100 dark:fill-slate-900', stroke: '#64748B', icon: '🏗️', text: '#475569' },
  event: { bg: 'fill-amber-50 dark:fill-amber-950', stroke: '#F59E0B', icon: '⏰', text: '#D97706' },
  lambda: { bg: 'fill-violet-50 dark:fill-violet-950', stroke: '#8B5CF6', icon: '⚡', text: '#7C3AED' }
};

export default function CloudArchitectureView() {
  const { generateLambdaReport } = useQueue();
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [lambdaReport, setLambdaReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const arch = ARCH_VERSIONS[selectedVersion];
  const colorMap = {
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30', ring: 'ring-cyan-500/30' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-500/30' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/30', ring: 'ring-violet-500/30' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', ring: 'ring-amber-500/30' }
  };
  const colors = colorMap[arch.color] || colorMap.cyan;

  const handleTriggerReport = async () => {
    setReportLoading(true);
    const report = await generateLambdaReport();
    setLambdaReport(report);
    setReportLoading(false);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Cloud className="w-5 h-5 text-cyan-500" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">AWS Cloud Architecture</p>
        </div>
        <h2 className="text-2xl font-extrabold text-brand-heading">Evolving Cloud Architecture — V1 to V7</h2>
        <p className="text-sm text-brand-muted mt-1">Interactive cloud infrastructure evolution for QueuePulse QaaS.</p>
      </div>

      {/* Version Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {ARCH_VERSIONS.map((v, i) => {
          const isActive = i === selectedVersion;
          const vc = colorMap[v.color] || colorMap.cyan;
          return (
            <button
              key={v.version}
              onClick={() => { setSelectedVersion(i); setLambdaReport(null); }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? `${vc.bg} ${vc.border} border ${vc.text} ring-2 ${vc.ring} shadow-sm font-bold`
                  : 'bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-heading hover:bg-brand-bg shadow-sm'
              }`}
            >
              <span className="text-xs font-mono font-bold">{v.version}</span>
              <span className="hidden sm:inline">{v.title}</span>
            </button>
          );
        })}
      </div>

      {/* Architecture Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagram */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
              {arch.version}
            </span>
            <h3 className="text-lg font-bold text-brand-heading">{arch.title}</h3>
          </div>

          {/* SVG Topology Diagram */}
          <div className="bg-brand-bg rounded-xl p-4 border border-brand-border overflow-x-auto">
            <svg width="580" height="320" viewBox="0 0 580 320" className="w-full">
              {/* Connection Lines */}
              {arch.connections.map((conn, i) => {
                const from = arch.nodes[conn.from];
                const to = arch.nodes[conn.to];
                if (!from || !to) return null;
                const mx = (from.x + to.x) / 2;
                const my = (from.y + to.y) / 2;
                return (
                  <g key={`conn-${i}`}>
                    <line
                      x1={from.x + 60} y1={from.y + 20}
                      x2={to.x + 60} y2={to.y + 20}
                      stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="2" strokeDasharray="6 4"
                    />
                    {conn.label && (
                      <g>
                        <rect x={mx + 30} y={my + 6} width={conn.label.length * 7 + 14} height={18} rx="4" className="fill-brand-surface stroke-brand-border" strokeWidth="1" />
                        <text x={mx + 37 + conn.label.length * 3.5} y={my + 19} fill="currentColor" className="text-slate-600 dark:text-slate-400 font-medium" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                          {conn.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {arch.nodes.map((node, i) => {
                const style = NODE_STYLES[node.type] || NODE_STYLES.compute;
                return (
                  <g key={`node-${i}`}>
                    <rect
                      x={node.x} y={node.y}
                      width="120" height="44"
                      rx="10"
                      className={style.bg}
                      stroke={style.stroke}
                      strokeWidth="1.5"
                    />
                    <text x={node.x + 14} y={node.y + 18} fontSize="14">{style.icon}</text>
                    <text x={node.x + 34} y={node.y + 20} fill="currentColor" className="text-slate-800 dark:text-slate-200" fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                      {node.label.length > 16 ? node.label.substring(0, 16) + '…' : node.label}
                    </text>
                    <text x={node.x + 34} y={node.y + 33} fill="currentColor" className="text-slate-500 dark:text-slate-400" fontSize="8" fontFamily="JetBrains Mono, monospace">
                      {node.type.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-sm text-brand-body mt-4 leading-relaxed">{arch.description}</p>

          {/* AWS Services Used */}
          <div className="flex flex-wrap gap-2 mt-4">
            {arch.awsServices.map(svc => (
              <span key={svc} className="px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-surface border border-brand-border text-brand-body shadow-sm">
                {svc}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-4">
          {/* Live Health Simulation */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-brand-heading mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Live Node Health
            </h4>
            <div className="space-y-2.5">
              {[
                { name: 'CloudFront CDN', latency: '12ms', status: 'Healthy' },
                { name: 'ALB (us-east-1)', latency: '3ms', status: 'Healthy' },
                { name: 'EC2 AZ-1a', latency: '8ms', status: 'Healthy' },
                { name: 'EC2 AZ-1b', latency: '11ms', status: 'Healthy' },
                { name: 'RDS Primary', latency: '4ms', status: 'Healthy' },
                { name: 'Lambda Worker', latency: '42ms', status: 'Idle' }
              ].map(node => (
                <div key={node.name} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-brand-bg/60 border border-brand-border/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${node.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-xs font-semibold text-brand-heading">{node.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-muted">{node.latency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* V7 Lambda Trigger */}
          {selectedVersion === 6 && (
            <div className="glass-panel rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-brand-heading mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-500" /> Trigger V7 Lambda Report
              </h4>
              <p className="text-xs text-brand-muted mb-3">Simulate an AWS Lambda invocation that queries RDS and generates an analytics report.</p>
              <button
                onClick={handleTriggerReport}
                disabled={reportLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md transition-colors disabled:opacity-50 active:scale-[0.97]"
              >
                {reportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                {reportLoading ? 'Executing…' : 'Execute Lambda'}
              </button>

              {lambdaReport && (
                <div className="mt-4 p-3 rounded-xl bg-brand-surface border border-brand-border text-xs space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Execution Complete
                  </div>
                  <div className="font-mono text-brand-body space-y-1">
                    <p>Report ID: <span className="text-brand-heading font-bold">{lambdaReport.reportId}</span></p>
                    <p>Runtime: <span className="text-brand-heading">{lambdaReport.awsExecutionInfo?.runtime}</span></p>
                    <p>Duration: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{lambdaReport.awsExecutionInfo?.durationMs}ms</span></p>
                    <p>Region: <span className="text-brand-heading">{lambdaReport.awsExecutionInfo?.region}</span></p>
                    <p>Customers: <span className="text-brand-heading font-bold">{lambdaReport.summary?.totalCustomersProcessed}</span></p>
                    <p>Satisfaction: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{lambdaReport.summary?.averageSatisfactionScore}/5</span></p>
                    <p>Redirections: <span className="text-amber-600 dark:text-amber-400 font-bold">{lambdaReport.summary?.crossBranchRedirections}</span></p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Architecture Evolution Timeline */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-brand-heading mb-3">Architecture Evolution</h4>
            <div className="space-y-3">
              {ARCH_VERSIONS.map((v, i) => {
                const isActive = i === selectedVersion;
                const isPast = i < selectedVersion;
                return (
                  <button
                    key={v.version}
                    onClick={() => { setSelectedVersion(i); setLambdaReport(null); }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                      isActive ? 'bg-brand-surface border border-brand-border shadow-sm' : 'hover:bg-brand-bg/60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isPast ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : isActive ? `${colors.bg} ${colors.text}` : 'bg-brand-bg text-brand-muted'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : v.version}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-brand-heading' : 'text-brand-muted'}`}>{v.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
