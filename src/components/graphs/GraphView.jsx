import { useState, useMemo, useRef, useEffect } from 'react';
import { create, all } from 'mathjs';
import { Plus, Trash2, Move } from 'lucide-react';
import Button from '../ui/Button';
import './Graph.css';

const math = create(all);

export default function GraphView() {
  const [func, setFunc] = useState('sin(x) * x');
  const [error, setError] = useState('');
  const [points, setPoints] = useState([]);

  // Variables matemáticas para Panning y Zooming
  const width = 800; // Resolucion Virtual
  const height = 500;
  
  const [center, setCenter] = useState({ x: 0, y: 0 }); // El medio del plano cartesiano
  const [zoom, setZoom] = useState(12); // Unidades del plano visibles desde el centro a un borde vertical

  // Mouse drag state
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panOrigin, setPanOrigin] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const graphData = useMemo(() => {
    try {
      const compiled = math.compile(func);
      let calculatedPoints = [];
      
      const ratio = width / height;
      const rangeX = [center.x - (zoom * ratio), center.x + (zoom * ratio)];
      const rangeY = [center.y - zoom, center.y + zoom];

      const paso = (rangeX[1] - rangeX[0]) / 300; 
      for (let x = rangeX[0]; x <= rangeX[1]; x += paso) {
        let y;
        try { y = compiled.evaluate({ x }); } catch (e) { y = NaN; }
        
        if (typeof y === 'number' && isFinite(y)) {
          calculatedPoints.push({ x, y });
        }
      }

      const mapX = (xVal) => ((xVal - rangeX[0]) / (rangeX[1] - rangeX[0])) * width;
      const mapY = (yVal) => height - ((yVal - rangeY[0]) / (rangeY[1] - rangeY[0])) * height;

      let pathLine = '';
      calculatedPoints.forEach((p, i) => {
         if (i === 0) pathLine += `M ${mapX(p.x)} ${mapY(p.y)} `;
         else {
             const prevP = calculatedPoints[i-1];
             if (Math.abs(p.y - prevP.y) > zoom) {
                 pathLine += `M ${mapX(p.x)} ${mapY(p.y)} `;
             } else {
                 pathLine += `L ${mapX(p.x)} ${mapY(p.y)} `;
             }
         }
      });

      setError('');
      return { pathLine, mapX, mapY, rangeX, rangeY };
      
    } catch(err) {
      setError('Función inválida (p.e: sin(x))');
      return null;
    }
  }, [func, center, zoom]);

  // Manejo de Interacción de Mouse (Panning)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanOrigin({ x: center.x, y: center.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dxPx = e.clientX - dragStart.x;
    const dyPx = e.clientY - dragStart.y;
    
    // Convertir pixeles arrastrados a unidades matemáticas
    const ratio = width / height;
    const widthMathUnits = zoom * 2 * ratio;
    const heightMathUnits = zoom * 2;

    const dxMath = (dxPx / svgRef.current.clientWidth) * widthMathUnits;
    const dyMath = (dyPx / svgRef.current.clientHeight) * heightMathUnits;

    // Al arrastrar el mouse a la DERECHA (+dx), el centro debe ir a la IZQUIERDA (-dx)
    // Al arrastrar ABAJO (+dy), el centro debe ir ARRIBA (+dy) debio a Y invertido
    setCenter({
      x: panOrigin.x - dxMath,
      y: panOrigin.y + dyMath,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom interactivo
  const handleWheel = (e) => {
    // Math.sign retorna 1 si la rueda va hacia abajo (alejar), -1 si hacia arriba (acercar)
    const zoomFactor = 1.15;
    if (e.deltaY > 0) {
      setZoom((prev) => Math.min(prev * zoomFactor, 1000));
    } else {
      setZoom((prev) => Math.max(prev / zoomFactor, 0.1));
    }
  };

  // Global mouse up for safety
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const resetCenter = () => { setCenter({x:0 , y:0}); setZoom(12); };

  const addPoint = () => setPoints([...points, { id: Date.now(), x: 0, y: 0, isNew: true }]);
  const removePoint = (id) => setPoints(points.filter(p => p.id !== id));
  const updatePoint = (id, axis, value) => setPoints(points.map(p => p.id === id ? { ...p, [axis]: Number(value) || 0 } : p));

  return (
    <div className="graph-container glass-panel">
      <div className="graph-sidebar">
        <h2 className="graph-title">Plano Cartesiano Interactivo</h2>
        
        <div className="graph-input-wrapper">
          <span className="mono-text label">f(x) = </span>
          <input 
            type="text" 
            value={func} 
            onChange={(e) => setFunc(e.target.value)}
            className={`graph-input mono-text ${error ? 'error' : ''}`}
          />
        </div>
        {error && <span className="graph-error">{error}</span>}

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <Button variant="science" onClick={() => setFunc(func + 'sin(')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>sin</Button>
          <Button variant="science" onClick={() => setFunc(func + 'cos(')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>cos</Button>
          <Button variant="science" onClick={() => setFunc(func + 'tan(')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>tan</Button>
          <Button variant="science" onClick={() => setFunc(func + 'sqrt(')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>√</Button>
          <Button variant="science" onClick={() => setFunc(func + '^')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>xʸ</Button>
          <Button variant="science" onClick={() => setFunc(func + 'pi')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>π</Button>
          <Button variant="science" onClick={() => setFunc(func + 'e')} style={{ padding: '4px 10px', fontSize: '0.9rem', minHeight: 0 }}>e</Button>
        </div>

        <Button onClick={resetCenter} variant="science" style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
          <Move size={16}/> Centrar Vista
        </Button>

        <div className="points-manager">
          <div className="points-header">
            <h3>Coordenadas Analíticas</h3>
            <button className="add-point-btn" onClick={addPoint}><Plus size={16}/></button>
          </div>
          <div className="points-list">
            {points.map(p => (
              <div key={p.id} className="point-item">
                <span className="coord-label">x</span>
                <input type="number" step="0.5" value={p.x === 0 && p.isNew ? '' : p.x} placeholder="0" 
                  onFocus={(e) => { e.target.select(); p.isNew=false; }} 
                  onChange={(e) => updatePoint(p.id, 'x', e.target.value)} className="point-input" />
                <span className="coord-label">y</span>
                <input type="number" step="0.5" value={p.y === 0 && p.isNew ? '' : p.y} placeholder="0" 
                  onFocus={(e) => { e.target.select(); p.isNew=false; }} 
                  onChange={(e) => updatePoint(p.id, 'y', e.target.value)} className="point-input" />
                <button className="del-point-btn" onClick={() => removePoint(p.id)}><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="graph-plot-area">
        <div className="svg-container" 
             onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onWheel={handleWheel} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
          
          <div className="graph-instructions">🖱️ Arrastra o Escrolea para explorar</div>

          {graphData && (
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="graph-svg">
              
              {/* Plano Cartesiano X e Y */}
              {(graphData.mapY(0) >= 0 && graphData.mapY(0) <= height) && (
                <line x1="0" y1={graphData.mapY(0)} x2={width} y2={graphData.mapY(0)} className="axis" />
              )}
              {(graphData.mapX(0) >= 0 && graphData.mapX(0) <= width) && (
                <line x1={graphData.mapX(0)} y1="0" x2={graphData.mapX(0)} y2={height} className="axis" />
              )}
              
              {/* Grid Guides (10 rules each segment mapping) */}
              {[...Array(21)].map((_, i) => {
                 const xVal = Math.floor(graphData.rangeX[0]) + i;
                 return <line key={`gx-${i}`} x1={graphData.mapX(xVal)} y1="0" x2={graphData.mapX(xVal)} y2={height} className="grid-line" />
              })}
              {[...Array(21)].map((_, i) => {
                 const yVal = Math.floor(graphData.rangeY[0]) + i;
                 return <line key={`gy-${i}`} x1="0" y1={graphData.mapY(yVal)} x2={width} y2={graphData.mapY(yVal)} className="grid-line" />
              })}

              <path d={graphData.pathLine} className="plot-line glass-glow" fill="none" />
              
              {/* Puntos estáticos */}
              {points.map(p => (
                <circle key={p.id} cx={graphData.mapX(p.x)} cy={graphData.mapY(p.y)} r="8" className="plot-point glass-glow"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
              
              {/* Tooltip personalizado */}
              {hoveredPoint && (
                <g transform={`translate(${graphData.mapX(hoveredPoint.x)}, ${graphData.mapY(hoveredPoint.y)})`} pointerEvents="none">
                  <rect x="-40" y="-32" width="80" height="22" rx="4" fill="var(--color-bg-base)" stroke="var(--color-accent-bright)" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"/>
                  <text x="0" y="-16" fill="var(--color-accent-bright)" fontSize="12px" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">
                    {hoveredPoint.x}, {hoveredPoint.y}
                  </text>
                </g>
              )}
              
              {/* Numeración Eje X */}
              {[...Array(Math.ceil((graphData.rangeX[1] - graphData.rangeX[0]) / Math.max(1, Math.floor(zoom / 5))) + 1)].map((_, i) => {
                 const step = Math.max(1, Math.floor(zoom / 5));
                 const xVal = Math.floor(graphData.rangeX[0] / step) * step + (i * step);
                 if (xVal === 0 || xVal > graphData.rangeX[1]) return null;
                 const yPos = Math.max(15, Math.min(height - 5, graphData.mapY(0) + 15));
                 return <text key={`tx-${i}`} x={graphData.mapX(xVal)} y={yPos} className="axis-text" textAnchor="middle">{xVal}</text>
              })}

              {/* Numeración Eje Y */}
              {[...Array(Math.ceil((graphData.rangeY[1] - graphData.rangeY[0]) / Math.max(1, Math.floor(zoom / 5))) + 1)].map((_, i) => {
                 const step = Math.max(1, Math.floor(zoom / 5));
                 const yVal = Math.floor(graphData.rangeY[0] / step) * step + (i * step);
                 if (yVal === 0 || yVal > graphData.rangeY[1]) return null;
                 const xPos = Math.max(15, Math.min(width - 25, graphData.mapX(0) - 10));
                 return <text key={`ty-${i}`} x={xPos} y={graphData.mapY(yVal) + 4} className="axis-text" textAnchor="end">{yVal}</text>
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
