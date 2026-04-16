import { Calculator, History, LineChart, Grid3X3 } from 'lucide-react';
import './Layout.css';

export default function Sidebar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'calculator', label: 'Calculadora', icon: Calculator },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'matrices', label: 'Matrices', icon: Grid3X3 },
    { id: 'graphs', label: 'Gráficos', icon: LineChart }
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <Calculator size={28} className="brand-icon" />
        <span className="brand-text">ProCalc</span>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
              aria-label={item.label}
              title={item.label}
            >
              <Icon size={24} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
