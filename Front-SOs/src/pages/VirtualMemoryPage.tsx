import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import "./VirtualMemoryPage.css";

export default function VirtualMemoryPage() {
  const [pageSize, setPageSize] = useState(10);
  const [frames, setFrames] = useState(7);
  const [algorithm, setAlgorithm] = useState("LRU");

  const [isRunning, setIsRunning] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageFrames, setPageFrames] = useState<(number | null)[]>([]);
  const [pageFaults, setPageFaults] = useState(0);
  const [accessLog, setAccessLog] = useState<any[]>([]);

  const referenceSequence = [1, 3, 0, 3, 5, 6, 3, 1, 6, 3, 1, 2, 4, 2, 1, 3, 5, 2];

  useEffect(() => {
    resetSimulation();
  }, [frames, algorithm]);

  const resetSimulation = () => {
    setPageFrames(Array(frames).fill(null));
    setPageFaults(0);
    setCurrentStep(0);
    setAccessLog([]);
    setIsRunning(false);
    setIsAutoPlay(false);
  };

  const fifoStep = (frames: (number | null)[], page: number) => {
    if (frames.includes(page)) {
      return { frames, fault: false, replacedFrame: -1 };
    }

    let newFrames = [...frames];
    let replacedFrame = -1;
    const emptyIndex = newFrames.findIndex(f => f === null);

    if (emptyIndex !== -1) {
      newFrames[emptyIndex] = page;
    } else {
      replacedFrame = 0;
      newFrames.shift();
      newFrames.push(page);
    }

    return { frames: newFrames, fault: true, replacedFrame };
  };

  const lruStep = (frames: (number | null)[], page: number, history: any[]) => {
    if (frames.includes(page)) {
      return { frames, fault: false, replacedFrame: -1 };
    }

    let newFrames = [...frames];
    let replacedFrame = -1;
    const emptyIndex = newFrames.findIndex(f => f === null);

    if (emptyIndex !== -1) {
      newFrames[emptyIndex] = page;
    } else {
      let lruIndex = 0;
      let oldestAccess = Infinity;

      for (let i = 0; i < newFrames.length; i++) {
        const lastAccess = history.map(h => h.page).lastIndexOf(newFrames[i]);
        if (lastAccess < oldestAccess) {
          oldestAccess = lastAccess;
          lruIndex = i;
        }
      }

      replacedFrame = lruIndex;
      newFrames[lruIndex] = page;
    }

    return { frames: newFrames, fault: true, replacedFrame };
  };

  const lfuStep = (frames: (number | null)[], page: number, history: any[]) => {
    if (frames.includes(page)) {
      return { frames, fault: false, replacedFrame: -1 };
    }

    let newFrames = [...frames];
    let replacedFrame = -1;
    const emptyIndex = newFrames.findIndex(f => f === null);

    if (emptyIndex !== -1) {
      newFrames[emptyIndex] = page;
    } else {
      let lfuIndex = 0;
      let minFreq = Infinity;

      for (let i = 0; i < newFrames.length; i++) {
        const freq = history.filter(h => h.page === newFrames[i]).length;
        if (freq < minFreq) {
          minFreq = freq;
          lfuIndex = i;
        }
      }

      replacedFrame = lfuIndex;
      newFrames[lfuIndex] = page;
    }

    return { frames: newFrames, fault: true, replacedFrame };
  };

  const executeStep = () => {
    if (currentStep >= referenceSequence.length) return;

    const page = referenceSequence[currentStep];
    let result;

    switch (algorithm) {
      case 'FIFO':
        result = fifoStep(pageFrames, page);
        break;
      case 'LRU':
        result = lruStep(pageFrames, page, accessLog);
        break;
      case 'LFU':
        result = lfuStep(pageFrames, page, accessLog);
        break;
      default:
        result = fifoStep(pageFrames, page);
    }

    setPageFrames(result.frames);
    if (result.fault) setPageFaults(p => p + 1);

    setAccessLog(prev => [...prev, {
      step: currentStep + 1,
      page,
      frames: [...result.frames],
      fault: result.fault,
      replacedFrame: result.replacedFrame,
    }]);

    setCurrentStep(s => s + 1);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && isRunning && currentStep < referenceSequence.length) {
      interval = setInterval(() => executeStep(), 1200);
    } else if (currentStep >= referenceSequence.length) {
      setIsAutoPlay(false);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, isRunning, currentStep]);

  const handleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
    setIsRunning(!isAutoPlay);
  };

  const frameArray = Array.from({ length: frames }, (_, i) => i);

  return (
    <div className="vm-page-container">
      <NavBar />

      <header className="vm-page-header">
        <h1>Gerenciamento de Memória Virtual</h1>
        <p>Visualize algoritmos de substituição de páginas e conceitos de memória virtual</p>
      </header>

      <div className="vm-page-content">
        <div className="vm-left-panel">
          <div className="vm-config-card">
            <h2>Configuração</h2>
            <p className="vm-config-subtitle">Defina os parâmetros do gerenciamento de memória</p>

            <div className="vm-config-item">
              <label>Tamanho da Página: {pageSize} KB</label>
              <input type="range" min="1" max="20" value={pageSize} onChange={(e) => setPageSize(+e.target.value)} />
            </div>

            <div className="vm-config-item">
              <label>Número de Frames: {frames}</label>
              <input type="range" min="2" max="7" value={frames} onChange={(e) => setFrames(+e.target.value)} />
            </div>

            <div className="vm-config-item">
              <label>Algoritmo de Substituição</label>
              <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                <option value="FIFO">FIFO - First In, First Out (Primeiro a Entrar, Primeiro a Sair)</option>
                <option value="LRU">LRU - Least Recently Used (Menos Recentemente Usado)</option>
                <option value="LFU">LFU - Least Frequently Used (Menos Frequentemente Usado)</option>
              </select>
            </div>

            <button className="vm-play-button" onClick={handleAutoPlay}>
              {isAutoPlay ? '⏸ Pausar' : '▶ Executar Automaticamente'}
            </button>
            <button className="vm-reset-button" onClick={resetSimulation}>⟳ Reiniciar</button>
          </div>

          <div className="vm-stats-card">
            <h2>Estatísticas</h2>
            <div className="vm-stat-item">
              <span>Page Faults:</span>
              <span className="vm-fault-value">{pageFaults}</span>
            </div>
            <div className="vm-stat-item">
              <span>Page Hits:</span>
              <span className="vm-stat-badge">{currentStep - pageFaults}</span>
            </div>
            <div className="vm-stat-item">
              <span>Taxa de Acerto:</span>
              <span className="vm-stat-badge">
                {currentStep > 0 ? Math.round(((currentStep - pageFaults) / currentStep) * 100) : 0}%
              </span>
            </div>
            <div className="vm-stat-item">
              <span>Etapa Atual:</span>
              <span className="vm-stat-badge">{currentStep}/{referenceSequence.length}</span>
            </div>
          </div>
        </div>

        <div className="vm-right-panel">
          <div className="vm-memory-card">
            <h2>Estado Atual da Memória</h2>
            <p className="vm-memory-subtitle">Frames utilizados na memória física</p>

            <div className="vm-memory-frames">
              {pageFrames.map((val, i) => (
                <div key={i} className="vm-memory-frame">
                  <span className="vm-frame-title">Frame {i}</span>
                  <div className="vm-frame-box">{val !== null ? val : '-'}</div>
                </div>
              ))}
            </div>

            <div className="vm-memory-legend">
              <div className="vm-legend vm-legend-new">
                <div className="vm-legend-box"></div> Página recém-carregada
              </div>
              <div className="vm-legend vm-legend-replaced">
                <div className="vm-legend-box"></div> Página substituída
              </div>
              <div className="vm-legend vm-legend-existing">
                <div className="vm-legend-box"></div> Página já existente
              </div>
            </div>
          </div>

          <div className="vm-timeline-card">
            <h2>Linha do Tempo de Execução</h2>
            <p className="vm-timeline-subtitle">Visualize o processo de substituição de páginas passo a passo</p>

            <div className="vm-timeline-header">
              <div>Etapa</div>
              <div>Página</div>
              <div>Frames</div>
              <div>Fault</div>
            </div>

            {accessLog.map((log, index) => (
              <div className="vm-timeline-row" key={index}>
                <div>{log.step}</div>
                <div>{log.page}</div>
                <div>{log.frames.join(' ')}</div>
                <div><span className={log.fault ? "vm-timeline-fault" : "vm-timeline-hit"}>
                  {log.fault ? "Sim" : "Não"}
                </span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
