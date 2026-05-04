import { useCalculatorStore } from '../../store/useCalculatorStore';
import { isErrorResult } from '../../engine/mathEngine';
import './Calculator.css';

export default function Display() {
  const { expression, result, setExpression, calculate, isEvaluated } = useCalculatorStore();

  const isError = isErrorResult(result);

  const handleKeyDown = (e) => {
    const key = e.key;

    // Fix UX: Enter y = ejecutan el cálculo
    if (key === 'Enter' || key === '=') {
      e.preventDefault();
      calculate();
      return;
    }

    // Permitir teclas de control y navegación siempre
    if (e.ctrlKey || e.altKey || e.metaKey || key.length > 1) return;

    const keyLower = key.toLowerCase();

    // Mapeo de atajos de teclado a funciones matemáticas
    const shortcuts = {
      's': 'sin(',
      'c': 'cos(',
      't': 'tan(',
      'l': 'log(',
      'n': 'ln(',
      'r': '√(',
      'p': 'π',
      // 'e' se deja pasar normal: es un char válido (constante e y notación científica)
      'x': '×',
      '*': '×',
      '/': '÷',
    };

    if (shortcuts[keyLower]) {
      e.preventDefault();
      const input = e.target;
      const start = input.selectionStart ?? expression.length;
      const end = input.selectionEnd ?? expression.length;
      const insert = shortcuts[keyLower];
      const newExpr = expression.substring(0, start) + insert + expression.substring(end);
      setExpression(newExpr);
      setTimeout(() => input.setSelectionRange(start + insert.length, start + insert.length), 0);
      return;
    }

    // Permitir dígitos, operadores básicos y punto siempre
    if (/[\d\+\-\.\^\!\(\)\%]/.test(key)) return;

    // Bloquear cualquier otra letra que no tenga shortcut (evita corrupciones)
    if (/[a-wyz]/i.test(keyLower)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    // Fix: regex actualizado para permitir funciones legítimas de mathjs
    // No bloquear letras de funciones: sin, cos, tan, log, ln, sqrt, pi, etc.
    const value = e.target.value.replace(
      /[^0-9\.+\-×÷*\/\^%\(\)!sincotaleqrpixy\sπ√,]/g,
      ''
    );
    setExpression(value);
  };

  return (
    <div
      className={`display-area ${isEvaluated ? 'evaluated-mode' : 'typing-mode'}`}
      onClick={() => document.getElementById('calc-display')?.focus()}
    >
      <input
        id="calc-display"
        type="text"
        className="display-expression mono-text"
        value={expression}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe o hacé clic..."
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
      <div className={`display-result mono-text ${isError ? 'has-error' : ''}`}>
        {result || '0'}
      </div>
    </div>
  );
}
