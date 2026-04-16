import { useCalculatorStore } from '../../store/useCalculatorStore';
import './Calculator.css';

export default function Display() {
  const { expression, result, setExpression, isEvaluated } = useCalculatorStore();
  
  const isError = ['Error', 'División', 'Sintaxis', 'inválida', 'NaN'].some(err => result.includes(err));

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    
    // Permitir navegación, borrar, enter, etc
    if (e.ctrlKey || e.altKey || e.metaKey || key.length > 1) return;

    // Mapeo automático de teclado físico a funciones matemáticas
    const shortcuts = {
      's': 'sin(', 'c': 'cos(', 't': 'tan(',
      'l': 'log(', 'n': 'ln(', 'r': '√(',
      'p': 'π', 'e': 'e', 'x': '×',
      '*': '×', '/': '÷'
    };

    if (shortcuts[key]) {
      e.preventDefault();
      const input = e.target;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const insert = shortcuts[key];
      
      const newExpr = expression.substring(0, start) + insert + expression.substring(end);
      setExpression(newExpr);
      setTimeout(() => input.setSelectionRange(start + insert.length, start + insert.length), 0);
      return;
    }

    // Bloquear tajantemente cualquier otra letra para evitar corrupciones 'NaN'
    if (/[a-z]/i.test(key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={`display-area ${isEvaluated ? 'evaluated-mode' : 'typing-mode'}`} onClick={() => document.getElementById('calc-display')?.focus()}>
      <input 
        id="calc-display"
        type="text"
        className="display-expression mono-text"
        value={expression}
        onChange={(e) => setExpression(e.target.value.replace(/[^0-9\.\+\-×÷\*\/\^\%\(\)\!sincotaleqrpixy\s√π,]/g, ''))}
        onKeyDown={handleKeyDown}
        placeholder="Escribe o haz clic..."
        autoFocus
        autoComplete="off"
      />
      <div className={`display-result mono-text ${isError ? 'has-error' : ''}`}>
        {result || '0'}
      </div>
    </div>
  );
}
