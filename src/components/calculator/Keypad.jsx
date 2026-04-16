import { useCalculatorStore } from '../../store/useCalculatorStore';
import Button from '../ui/Button';
import { Delete } from 'lucide-react';
import './Calculator.css';

const OPERATORS = ['+', '-', '×', '÷', '%', '^'];

export default function Keypad() {
  const { expression, setExpression, calculate, clearExpression, isBasicMode, isEvaluated, result } = useCalculatorStore();

  const handleChar = (char) => (e) => {
    e.preventDefault(); 
    
    const input = document.getElementById('calc-display');
    const isCharOp = OPERATORS.includes(char);

    if (isEvaluated) {
      if (isCharOp) {
        setExpression(result + char);
        setTimeout(() => input?.setSelectionRange(result.length + 1, result.length + 1), 0);
      } else {
        setExpression(char);
        setTimeout(() => input?.setSelectionRange(1, 1), 0);
      }
      return;
    }

    if (!input) {
      if (expression.length === 0 && isCharOp && char !== '-') return;
      setExpression(expression + char);
      return;
    }

    let start = input.selectionStart || 0;
    let end = input.selectionEnd || 0;
    
    if (expression.length === 0 && start === 0 && isCharOp && char !== '-') return;
    
    const prevCharIsOp = start > 0 && OPERATORS.includes(expression[start - 1]);
    
    let newExpr;
    let newPos = start + char.length;

    if (isCharOp && prevCharIsOp) {
      // Reemplazar operador previo
      newExpr = expression.substring(0, start - 1) + char + expression.substring(end);
      newPos = start - 1 + char.length;
    } else {
      // Inserción normal
      newExpr = expression.substring(0, start) + char + expression.substring(end);
    }

    setExpression(newExpr);

    // Restaurar posición del cursor tras el re-render
    setTimeout(() => {
      input.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleDel = (e) => {
    e.preventDefault();
    const input = document.getElementById('calc-display');
    if (!input || expression.length === 0) return;
    
    let start = input.selectionStart || 0;
    let end = input.selectionEnd || 0;

    if (start === end && start > 0) {
      // Borrar un caracter hacia atrás
      const newExpr = expression.substring(0, start - 1) + expression.substring(end);
      setExpression(newExpr);
      setTimeout(() => input.setSelectionRange(start - 1, start - 1), 0);
    } else if (start !== end) {
      // Borrar selección
      const newExpr = expression.substring(0, start) + expression.substring(end);
      setExpression(newExpr);
      setTimeout(() => input.setSelectionRange(start, start), 0);
    }
  };

  const handleCalc = (e) => {
    e.preventDefault();
    calculate();
  };
  
  const handleAC = (e) => {
    e.preventDefault();
    clearExpression();
  }

  return (
    <div className="keypad-area">
      <div className={`keypad-grid ${!isBasicMode ? 'scientific' : ''}`}>
        
        {/* Fila Principal 1 */}
        {!isBasicMode && (
          <>
            <Button variant="science" onMouseDown={handleChar('sin(')}>sin</Button>
            <Button variant="science" onMouseDown={handleChar('log(')}>log</Button>
          </>
        )}
        <Button variant="action" onMouseDown={handleAC}>AC</Button>
        <Button variant="action" onMouseDown={handleDel}><Delete size={20}/></Button>
        {!isBasicMode ? (
          <Button variant="operator" onMouseDown={handleChar('(')}>(</Button>
        ) : (
          <Button variant="operator" onMouseDown={handleChar('%')}>%</Button>
        )}
        <Button variant="operator" onMouseDown={handleChar('÷')}>÷</Button>

        {/* Fila Principal 2 */}
        {!isBasicMode && (
          <>
            <Button variant="science" onMouseDown={handleChar('cos(')}>cos</Button>
            <Button variant="science" onMouseDown={handleChar('ln(')}>ln</Button>
          </>
        )}
        <Button onMouseDown={handleChar('7')}>7</Button>
        <Button onMouseDown={handleChar('8')}>8</Button>
        <Button onMouseDown={handleChar('9')}>9</Button>
        <Button variant="operator" onMouseDown={handleChar('×')}>×</Button>

        {/* Fila Principal 3 */}
        {!isBasicMode && (
          <>
            <Button variant="science" onMouseDown={handleChar('tan(')}>tan</Button>
            <Button variant="science" onMouseDown={handleChar('√(')}>√</Button>
          </>
        )}
        <Button onMouseDown={handleChar('4')}>4</Button>
        <Button onMouseDown={handleChar('5')}>5</Button>
        <Button onMouseDown={handleChar('6')}>6</Button>
        <Button variant="operator" onMouseDown={handleChar('-')}>-</Button>

        {/* Fila Principal 4 */}
        {!isBasicMode && (
          <>
            <Button variant="science" onMouseDown={handleChar('π')}>π</Button>
            <Button variant="science" onMouseDown={handleChar('^')}>xʸ</Button>
          </>
        )}
        <Button onMouseDown={handleChar('1')}>1</Button>
        <Button onMouseDown={handleChar('2')}>2</Button>
        <Button onMouseDown={handleChar('3')}>3</Button>
        <Button variant="operator" onMouseDown={handleChar('+')}>+</Button>

        {/* Fila Principal 5 */}
        {!isBasicMode && (
          <>
            <Button variant="science" onMouseDown={handleChar('e')}>e</Button>
            <Button variant="science" onMouseDown={handleChar('!')}>x!</Button>
          </>
        )}
        <Button className={isBasicMode ? "btn-zero" : ""} onMouseDown={handleChar('0')}>0</Button>
        <Button onMouseDown={handleChar('.')}>.</Button>
        {!isBasicMode && (
          <Button variant="operator" onMouseDown={handleChar(')')}>)</Button>
        )}
        <Button variant="primary" className={isBasicMode ? "btn-equals" : ""} onMouseDown={handleCalc}>=</Button>
      </div>
    </div>
  );
}
