import { useState, useEffect } from 'react';
import { create, all } from 'mathjs';
import Button from '../ui/Button';
import './Matrices.css';

const math = create(all);

export default function MatricesView() {
  // Matriz A
  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [matrixA, setMatrixA] = useState(Array(3).fill().map(() => Array(3).fill(0)));

  // Matriz B
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);
  const [matrixB, setMatrixB] = useState(Array(3).fill().map(() => Array(3).fill(0)));

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Sincronizador de tamaño al cambiar inputs Numéricos de Matriz
  const resizeMatrix = (matrix, oldR, oldC, newR, newC) => {
    const newM = Array(newR).fill().map(() => Array(newC).fill(0));
    for (let i = 0; i < Math.min(oldR, newR); i++) {
      for (let j = 0; j < Math.min(oldC, newC); j++) {
        newM[i][j] = matrix[i][j];
      }
    }
    return newM;
  };

  useEffect(() => {
    setMatrixA(prev => resizeMatrix(prev, prev.length, prev[0].length, rowsA, colsA));
  }, [rowsA, colsA]);

  useEffect(() => {
    setMatrixB(prev => resizeMatrix(prev, prev.length, prev[0].length, rowsB, colsB));
  }, [rowsB, colsB]);

  const handleCellChange = (matrixSetter, mArray, r, c, val) => {
    const newM = [...mArray];
    newM[r] = [...newM[r]];
    newM[r][c] = val;
    matrixSetter(newM);
  };

  const parseMatrix = (mArray) => {
    return mArray.map(row => row.map(val => {
      try { return Number(math.evaluate(val === '' ? '0' : String(val))); }
      catch { throw new Error('Valor inválido'); }
    }));
  };

  // Operaciones
  const calculateResult = (type) => {
    try {
      const mA = parseMatrix(matrixA);
      const mB = parseMatrix(matrixB);

      let res;
      if (type === 'Det(A)') res = math.det(mA);
      else if (type === 'Inv(A)') res = math.inv(mA);
      else if (type === 'Aᵀ') res = math.transpose(mA);
      else if (type === 'A + B') res = math.add(mA, mB);
      else if (type === 'A - B') res = math.subtract(mA, mB);
      else if (type === 'A × B') res = math.multiply(mA, mB);

      if (typeof res === 'number') {
        setResult(math.format(res, { precision: 7 }));
      } else {
        setResult(res.map(row => row.map(val => math.format(val, { precision: 4 }))));
      }
      setError('');
    } catch (e) {
      if (e.message.includes('Dimension mismatch')) setError('Error: Las dimensiones no coinciden para esta operación');
      else setError('Cálculo inválido para esta conformación matricial');
      setResult(null);
    }
  };

  return (
    <div className="matrices-container glass-panel">
      <div className="matrices-header">
        <h2 className="matrices-title">Matrices Dinámicas Libres</h2>
      </div>

      <div className="matrices-scroll">
        <div className="matrices-content">
          
          {/* MATRIZ A */}
          <div className="matrix-panel glass-panel">
            <div className="matrix-controls">
              <h3 className="section-subtitle">Matriz A</h3>
              <div className="dimension-inputs">
                <input type="number" min="1" max="10" value={rowsA} onChange={e => setRowsA(Number(e.target.value) || 1)} />
                <span>×</span>
                <input type="number" min="1" max="10" value={colsA} onChange={e => setColsA(Number(e.target.value) || 1)} />
              </div>
            </div>
            
            <div className="matrix-grid-scroll">
              <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${colsA}, 1fr)` }}>
                {matrixA.map((row, r) => row.map((val, c) => (
                  <input key={`A-${r}-${c}`} type="text" className="matrix-cell mono-text" 
                    value={val === 0 ? '' : val} 
                    placeholder="0"
                    onChange={(e) => handleCellChange(setMatrixA, matrixA, r, c, e.target.value)} 
                    onFocus={(e) => e.target.select()}
                  />
                )))}
              </div>
            </div>

            <div className="matrix-actions-grid">
              <Button onClick={() => calculateResult('Det(A)')}>Det(A)</Button>
              <Button onClick={() => calculateResult('Inv(A)')}>A⁻¹</Button>
              <Button onClick={() => calculateResult('Aᵀ')}>Aᵀ</Button>
            </div>
          </div>

          {/* MATRIZ B */}
          <div className="matrix-panel glass-panel">
            <div className="matrix-controls">
              <h3 className="section-subtitle">Matriz B</h3>
              <div className="dimension-inputs">
                <input type="number" min="1" max="10" value={rowsB} onChange={e => setRowsB(Number(e.target.value) || 1)} />
                <span>×</span>
                <input type="number" min="1" max="10" value={colsB} onChange={e => setColsB(Number(e.target.value) || 1)} />
              </div>
            </div>

            <div className="matrix-grid-scroll">
              <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${colsB}, 1fr)` }}>
                {matrixB.map((row, r) => row.map((val, c) => (
                  <input key={`B-${r}-${c}`} type="text" className="matrix-cell mono-text" 
                    value={val === 0 ? '' : val} 
                    placeholder="0"
                    onChange={(e) => handleCellChange(setMatrixB, matrixB, r, c, e.target.value)} 
                    onFocus={(e) => e.target.select()}
                  />
                )))}
              </div>
            </div>

            <div className="matrix-actions-grid">
              <Button variant="operator" onClick={() => calculateResult('A + B')}>A + B</Button>
              <Button variant="operator" onClick={() => calculateResult('A - B')}>A - B</Button>
              <Button variant="primary" onClick={() => calculateResult('A × B')}>A × B</Button>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="matrix-result-section">
          {error && <div className="matrix-error">{error}</div>}
          <div className="matrix-result-box">
            {result === null && <span className="empty-result">El resultado aparecerá aquí</span>}
            {typeof result === 'string' && <div className="scalar-result mono-text">{result}</div>}
            
            {Array.isArray(result) && (
              <div className="matrix-grid result-grid" style={{ gridTemplateColumns: `repeat(${result[0].length}, 1fr)` }}>
                {result.map((row, r) => row.map((val, c) => (
                  <div key={`res-${r}-${c}`} className="matrix-cell-display mono-text">{val}</div>
                )))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
