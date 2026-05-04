import { create, all } from 'mathjs';

const math = create(all, {
  number: 'BigNumber',
  precision: 64,
});

let currentAngleMode = 'DEG';

// --- Fix 1.2: Aliases correctos para ln y log ---
// En mathjs: log(x) = ln(x). Remapeamos para que log = log10 y ln = log natural.
math.import({
  ln: (x) => math.log(x),
  log: (x) => math.log10(x),
}, { override: true });

// --- Fix 1.5: Trigonometría completa en modo DEG (sin, cos, tan + inversas) ---
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const wrapForward = (fnName) => {
  const original = math[fnName];
  return (x) => {
    if (currentAngleMode === 'DEG') {
      // Convertimos el argumento de grados a radianes antes de pasar a la fn
      const xRad = math.multiply(x, DEG_TO_RAD);
      return original(xRad);
    }
    return original(x);
  };
};

const wrapInverse = (fnName) => {
  const original = math[fnName];
  return (x) => {
    const result = original(x);
    if (currentAngleMode === 'DEG') {
      // El resultado viene en radianes; convertimos a grados
      return math.multiply(result, RAD_TO_DEG);
    }
    return result;
  };
};

math.import({
  sin:  wrapForward('sin'),
  cos:  wrapForward('cos'),
  tan:  wrapForward('tan'),
  asin: wrapInverse('asin'),
  acos: wrapInverse('acos'),
  atan: wrapInverse('atan'),
}, { override: true });

// --- Fix 1.6: normalizeExpression sin destruir comas como separadores ---
const normalizeExpression = (expr) => {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    // Fix 1.3: % como /100 — aplica sobre dígito o cierre de paréntesis
    .replace(/([0-9\)])\s*%/g, '($1/100)');
    // Nota: las comas NO se tocan. mathjs acepta coma como separador de
    // argumentos de forma nativa (log(100,10) funciona sin transformar).
};

const ERROR_STRINGS = ['Error', 'División', 'Sintaxis', 'NaN', 'inválida'];

export const isErrorResult = (str) =>
  ERROR_STRINGS.some((e) => str.includes(e));

/**
 * Evaluación dinámica (preview mientras el usuario tipea).
 * Retorna '' si la expresión es parcialmente válida (evita ruido).
 */
export const evaluateMath = (expr, angleMode = 'DEG') => {
  if (!expr || expr.trim() === '') return '';

  try {
    currentAngleMode = angleMode;
    const safeExpr = normalizeExpression(expr);
    const result = math.evaluate(safeExpr);

    if (typeof result === 'function' || result === undefined) return '';

    const str = result.toString();
    if (str === 'Infinity' || str === '-Infinity') return 'División por cero';
    if (str === 'NaN') return 'Error matemático';

    return math.format(result, { precision: 12, lowerExp: -10, upperExp: 10 });
  } catch {
    return '';
  }
};

/**
 * Evaluación estricta al presionar =.
 * Retorna mensaje de error descriptivo si algo falla.
 */
export const evaluateStrict = (expr, angleMode = 'DEG') => {
  if (!expr) return '';
  try {
    currentAngleMode = angleMode;
    const safeExpr = normalizeExpression(expr);
    const result = math.evaluate(safeExpr);

    if (typeof result === 'function' || result === undefined) {
      return 'Error de Sintaxis';
    }

    const str = result.toString();
    if (str === 'Infinity' || str === '-Infinity') return 'División por cero';
    // Fix edge case: NaN puede venir de 0/0, no solo de raíces/logs
    if (str === 'NaN') return 'Resultado indefinido';

    return math.format(result, { precision: 12, lowerExp: -10, upperExp: 10 });
  } catch {
    return 'Error de Sintaxis';
  }
};
