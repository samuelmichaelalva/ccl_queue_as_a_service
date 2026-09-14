import { useState } from 'react';
import { QueueProvider } from './context/QueueContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import CustomerWalletView from './views/CustomerWalletView';
import StaffCounterView from './views/StaffCounterView';
import AdminAnalyticsView from './views/AdminAnalyticsView';
import CloudArchitectureView from './views/CloudArchitectureView';

const VIEW_MAP = {
  customer: CustomerWalletView,
  staff: StaffCounterView,
  admin: AdminAnalyticsView,
  cloud: CloudArchitectureView
};

export default function App() {
  const [currentRole, setCurrentRole] = useState('customer');
  const ActiveView = VIEW_MAP[currentRole] || CustomerWalletView;

  return (
    <ThemeProvider>
      <QueueProvider>
        <div className="min-h-screen bg-brand-bg text-brand-body flex flex-col transition-colors duration-200">
          <Navbar currentRole={currentRole} onRoleChange={setCurrentRole} />
          <main className="flex-1 overflow-y-auto">
            <ActiveView />
          </main>
        </div>
      </QueueProvider>
    </ThemeProvider>
  );
}
