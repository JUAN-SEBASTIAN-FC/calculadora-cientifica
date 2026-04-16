import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import CalculatorView from './components/calculator/CalculatorView';
import HistoryView from './components/history/HistoryView';
import GraphView from './components/graphs/GraphView';
import MatricesView from './components/matrices/MatricesView';
import ParticlesBackground from './components/ui/ParticlesBackground';
import { useCalculatorStore } from './store/useCalculatorStore';
import './components/layout/Layout.css';

function App() {
  const [currentView, setCurrentView] = useState('calculator');
  const { theme } = useCalculatorStore();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Asegura que las partículas se actualicen visualmente al cambiar de tema
  const keyToForceRerender = `particles-${theme}`;

  return (
    <div className="app-layout">
      {/* Sistema Core de Background Interactivo */}
      <ParticlesBackground key={keyToForceRerender} />

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="main-content">
        <TopBar currentView={currentView} />
        
        <div className="view-container">
          {currentView === 'calculator' && <CalculatorView />}
          {currentView === 'history' && <HistoryView />}
          {currentView === 'graphs' && <GraphView />}
          {currentView === 'matrices' && <MatricesView />}
        </div>
      </main>
    </div>
  );
}

export default App;
