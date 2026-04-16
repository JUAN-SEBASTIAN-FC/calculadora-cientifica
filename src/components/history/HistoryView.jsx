import { useCalculatorStore } from '../../store/useCalculatorStore';
import { Trash2, History as HistoryIcon, Minus } from 'lucide-react';
import './History.css';

export default function HistoryView() {
  const { history, clearHistory, loadHistory, removeHistoryItem } = useCalculatorStore();

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <HistoryIcon size={48} opacity={0.2} />
        <p>No hay cálculos aún</p>
        <span>Las operaciones recientes aparecerán aquí</span>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Historial</h2>
        <button className="history-clear-btn" onClick={clearHistory}>
          <Trash2 size={18} />
        </button>
      </div>
      <div className="history-list">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="history-item elevation-1"
            onClick={() => loadHistory(item.expr)}
            role="button"
            tabIndex={0}
          >
            <div style={{flex: 1}}>
              <div className="history-expr mono-text">{item.expr} =</div>
              <div className="history-res mono-text">{item.res}</div>
            </div>
            <button 
               className="history-single-del-btn" 
               onClick={(e) => { e.stopPropagation(); removeHistoryItem(item.id); }}
            >
              <Minus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
