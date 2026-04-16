import { Moon, Sun } from 'lucide-react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import './Layout.css';

export default function TopBar({ currentView }) {
  const { isBasicMode, toggleMode, angleMode, setAngleMode, theme, toggleTheme } = useCalculatorStore();

  return (
    <header className="topbar">
      <div className="topbar-toggles">
        {currentView === 'calculator' && (
          <>
            <div className="mode-toggle">
              <button 
                className={`toggle-btn ${isBasicMode ? 'active' : ''}`} 
                onClick={() => !isBasicMode && toggleMode()}
              >
                Básico
              </button>
              <button 
                className={`toggle-btn ${!isBasicMode ? 'active' : ''}`} 
                onClick={() => isBasicMode && toggleMode()}
              >
                Científico
              </button>
            </div>

            {!isBasicMode && (
              <div className="mode-toggle">
                <button 
                  className={`toggle-btn ${angleMode === 'DEG' ? 'active' : ''}`} 
                  onClick={() => setAngleMode('DEG')}
                >
                  DEG
                </button>
                <button 
                  className={`toggle-btn ${angleMode === 'RAD' ? 'active' : ''}`} 
                  onClick={() => setAngleMode('RAD')}
                >
                  RAD
                </button>
              </div>
            )}
          </>
        )}

        <button className="toggle-btn theme-toggle" onClick={toggleTheme} title="Cambiar Tema" aria-label="Cambiar Tema">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
