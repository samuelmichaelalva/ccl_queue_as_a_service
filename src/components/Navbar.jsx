import { useState } from 'react';
import {
  MonitorSmartphone,
  UserCog,
  BarChart3,
  Cloud,
  Wifi,
  WifiOff,
  Bell,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { useTheme } from '../context/ThemeContext';

const ROLES = [
  { key: 'customer', label: 'Customer Wallet', icon: MonitorSmartphone, color: 'text-cyan-500' },
  { key: 'staff', label: 'Staff Counter', icon: UserCog, color: 'text-emerald-500' },
  { key: 'admin', label: 'Admin Analytics', icon: BarChart3, color: 'text-violet-500' },
  { key: 'cloud', label: 'AWS Architecture', icon: Cloud, color: 'text-amber-500' }
];

export default function Navbar({ currentRole, onRoleChange }) {
  const { connected } = useQueue();
  const { theme, toggleTheme } = useTheme();

  const activeRole = ROLES.find(r => r.key === currentRole) || ROLES[0];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-brand-border backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-brand-bg animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-brand-heading">
                Queue<span className="text-cyan-500">Pulse</span>
              </h1>
              <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest -mt-0.5 hidden sm:block">Cloud-Native QaaS</p>
            </div>
          </div>

          {/* Role Switcher (Center) */}
          <div className="flex items-center gap-1 bg-brand-bg/80 rounded-xl p-1 border border-brand-border shadow-inner">
            {ROLES.map(role => {
              const Icon = role.icon;
              const isActive = role.key === currentRole;
              return (
                <button
                  key={role.key}
                  onClick={() => onRoleChange(role.key)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-brand-card border border-brand-border text-brand-heading shadow-md font-semibold'
                      : 'text-brand-muted hover:text-brand-heading hover:bg-brand-surface/70'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? role.color : ''}`} />
                  <span className="hidden lg:inline">{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Theme Toggle, Connection Status & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2 rounded-xl text-brand-muted hover:text-brand-heading hover:bg-brand-surface border border-brand-border transition-all flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Live Connection Indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
              connected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}>
              {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{connected ? 'Live' : 'Offline'}</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl text-brand-muted hover:text-brand-heading hover:bg-brand-surface border border-brand-border transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-brand-border">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-brand-border">
                {currentRole === 'customer' ? 'AM' : currentRole === 'staff' ? 'SL' : 'AD'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-brand-heading leading-tight">
                  {currentRole === 'customer' ? 'Alex Morgan' : currentRole === 'staff' ? 'Dr. Sarah Lin' : 'Admin'}
                </p>
                <p className="text-[10px] text-brand-muted leading-tight">
                  {activeRole.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
