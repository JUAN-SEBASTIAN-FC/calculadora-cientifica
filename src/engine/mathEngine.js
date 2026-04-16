import { create, all } from 'mathjs';

// Crear instancia de math.js orientada a máxima precisión
const math = create(all, {
  number: 'BigNumber',
  precision: 64, // Alta precisión para evitar errores de coma flotante
});

let currentAngleMode = 'DEG';

const replacer = (fnName) => {
  const originalFn = math[fnName];
  return function(x) {
    if (currentAngleMode === 'DEG') {
      try { return originalFn(math.evaluate(`${x} deg`)); } catch(e) { return originalFn(x); }
    }
    return originalFn(x);
  }
}

math.import({
  sin: replacer('sin'),
  cos: replacer('cos'),
  tan: replacer('tan')
}, { override: true });

const normalizeExpression = (expr) => {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/,/g, '.');
};

/**
 * Evalúa una expresión matemática y retorna el resultado o un error tipificado.
 * @param {string} expr Expansión a evaluar
 * @param {string} angleMode 'DEG' | 'RAD'
 * @returns {string} Resultado evaluado o cadena vacía si es inválido pacíficamente
 */
export const evaluateMath = (expr, angleMode = 'DEG') => {
  if (!expr || expr.trim() === '') return '';

  try {
    currentAngleMode = angleMode;
    const safeExpr = normalizeExpression(expr);
    
    // Intenta evaluar la expresión "al vuelo". 
    // Usamos evaluación aislada.
    const result = math.evaluate(safeExpr);

    // Si es una función no evaluada o algo indefinido:
    if (typeof result === 'function' || result === undefined) {
      return '';
    }

    // Comprobaciones de resultados especiales
    if (result.toString() === 'Infinity' || result.toString() === '-Infinity') {
      return 'División por cero';
    }
    
    if (result.toString() === 'NaN') {
      return 'Error matemático';
    }

    // Retorna formateado para display limpio
    return math.format(result, { precision: 12, lowerExp: -10, upperExp: 10 });
    
  } catch (error) {
    // Errores de sintaxis pacíficos mientras typed (el usuario está tecleando)
    // No mostramos error en la preview si le falta cerrar paréntesis, etc.
    return '';
  }
};

/**
 * Evalúa rígidamente al presionar `=`
 * Retorna error en texto rojo si es inválido
 */
export const evaluateStrict = (expr, angleMode = 'DEG') => {
  if (!expr) return '';
  try {
    currentAngleMode = angleMode;
    const safeExpr = normalizeExpression(expr);
    const result = math.evaluate(safeExpr);
    
    if (result.toString() === 'Infinity' || result.toString() === '-Infinity') {
      return 'División por cero';
    }
    if (result.toString() === 'NaN') {
      return 'Logaritmo/Raíz inválida';
    }

    return math.format(result, { precision: 12, lowerExp: -10, upperExp: 10 });
  } catch(err) {
    return 'Error de Sintaxis';
  }
}
