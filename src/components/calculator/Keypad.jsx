import { useCalculatorStore } from '../../store/useCalculatorStore';
import { isErrorResult } from '../../engine/mathEngine';
import Button from '../ui/Button';
import { Delete } from 'lucide-react';
import './Calculator.css';

// Operadores que NO pueden reemplazar a otro operador
// (el '-' es especial: puede ser signo negativo)
const OPERATORS = ['+', '-', '×', '÷', '%', '^'];
const BINARY_OPERATORS = ['+', '×', '÷', '^']; // nunca como primer char ni dobles

export default function Keypad() {
  const {
    expression,
    result,
    setExpression,
    calculate,
    clearExpression,
    appendAfterError,
    isBasicMode,
    isEvaluated,
  } = useCalculatorStore();

  const handleChar = (char) => (e) => {
    e.preventDefault();

    const input = document.getElementById('calc-display');
    const isCharOp = OPERATORS.includes(char);
    const isBinaryOp = BINARY_OPERATORS.includes(char);

    // Fix 1.4: si hay error en el resultado, no contaminar expresión
    if (isErrorResult(result)) {
      appendAfterError(char);
      return;
    }

    // Si acaba de evaluar (=), continuar desde el resultado
    if (isEvaluated) {
      if (isCharOp) {
        const newExpr = result + char;
        setExpression(newExpr);
        setTimeout(() => input?.setSelectionRange(newExpr.length, newExpr.length), 0);
      } else {
        setExpression(char);
        setTimeout(() => input?.setSelectionRange(1, 1), 0);
      }
      return;
    }

    if (!input) {
      if (expression.length === 0 && isBinaryOp) return;
      setExpression(expression + char);
      return;
    }

    let start = input.selectionStart ?? expression.length;
    let end = input.selectionEnd ?? expression.length;

    // No permitir operador binario al inicio
    if (expression.length === 0 && start === 0 && isBinaryOp) return;

    const prevChar = start > 0 ? expression[start - 1] : '';
    const prevCharIsOp = OPERATORS.includes(prevChar);

    let newExpr;
    let newPos = start + char.length;

    // Fix 1.1: solo reemplazar operador previo si el char TAMBIÉN es binario
    // Si es '-', permitir ingresarlo después de cualquier operador (número negativo)
    if (isBinaryOp && prevCharIsOp) {
      // Reemplazar el operador anterior por el nuevo operador binario
      newExpr = expression.substring(0, start - 1) + char + expression.substring(end);
      newPos = start - 1 + char.length;
    } else {
      // Inserción normal (incluyendo '-' después de operador = número negativo)
      newExpr = expression.substring(0, start) + char + expression.substring(end);
    }

    setExpression(newExpr);
    setTimeout(() => input.setSelectionRange(newPos, newPos), 0);
  };

  const handleDel = (e) => {
    e.preventDefault();
    const input = document.getElementById('calc-display');
    if (!input || expression.length === 0) return;

    let start = input.selectionStart ?? expression.length;
    let end = input.selectionEnd ?? expression.length;

    if (start === end && start > 0) {
      const newExpr = expression.substring(0, start - 1) + expression.substring(end);
      setExpression(newExpr);
      setTimeout(() => input.setSelectionRange(start - 1, start - 1), 0);
    } else if (start !== end) {
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
  };

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
        <Button className={isBasicMode ? 'btn-zero' : ''} onMouseDown={handleChar('0')}>0</Button>
        <Button onMouseDown={handleChar('.')}>.</Button>
        {!isBasicMode && (
          <Button variant="operator" onMouseDown={handleChar(')')}>)</Button>
        )}
        <Button variant="primary" className={isBasicMode ? 'btn-equals' : ''} onMouseDown={handleCalc}>=</Button>
      </div>
    </div>
  );
}
