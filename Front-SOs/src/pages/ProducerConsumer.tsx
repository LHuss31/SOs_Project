import React, { useState, useEffect, useRef } from "react";
import './ProducerConsumer.css';
import NavBar from '../components/NavBar';

type BufferItem = {
  id: number;
  producerId: number;
};

type LogEntry = {
  timestamp: string;
  msg: string;
  type: 'info' | 'producer' | 'consumer' | 'blocked' | 'system';
};

export default function ProducerConsumer() {
  const [buffer, setBuffer] = useState<BufferItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [producers, setProducers] = useState(2);
  const [consumers, setConsumers] = useState(2);
  const [bufferSize, setBufferSize] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    produced: 0,
    consumed: 0,
    bufferFull: 0,
    bufferEmpty: 0
  });

  const logEvent = (msg: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-49), { timestamp, msg, type }]);
  };

  const addToBuffer = (item: BufferItem) => {
    setBuffer(prev => {
      if (prev.length < bufferSize) {
        logEvent(`Producer ${item.producerId} added item ${item.id}`, 'producer');
        setStats(s => ({ ...s, produced: s.produced + 1 }));
        return [...prev, item];
      } else {
        logEvent(`Producer ${item.producerId} blocked - buffer full`, 'blocked');
        setStats(s => ({ ...s, bufferFull: s.bufferFull + 1 }));
        return prev;
      }
    });
  };

  const removeFromBuffer = (consumerId: number) => {
    setBuffer(prev => {
      if (prev.length > 0) {
        const item = prev[0];
        logEvent(`Consumer ${consumerId} consumed item ${item.id}`, 'consumer');
        setStats(s => ({ ...s, consumed: s.consumed + 1 }));
        return prev.slice(1);
      } else {
        logEvent(`Consumer ${consumerId} blocked - buffer empty`, 'blocked');
        setStats(s => ({ ...s, bufferEmpty: s.bufferEmpty + 1 }));
        return prev;
      }
    });
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        for (let i = 0; i < producers; i++) {
          if (Math.random() < 0.7) {
            const item: BufferItem = {
              id: Date.now() + Math.random(),
              producerId: i + 1,
            };
            addToBuffer(item);
          }
        }

        for (let i = 0; i < consumers; i++) {
          if (Math.random() < 0.6) {
            removeFromBuffer(i + 1);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, producers, consumers, bufferSize]);

  const handleStart = () => {
    setIsRunning(true);
    logEvent('Simulação iniciada', 'system');
  };

  const handleReset = () => {
    setIsRunning(false);
    setBuffer([]);
    setStats({ produced: 0, consumed: 0, bufferFull: 0, bufferEmpty: 0 });
    setLogs([]);
    logEvent('Simulação reiniciada', 'system');
  };

  return (
    <>
      <NavBar />
      <div className="pc-page">
        <header className="pc-header">
          <h1>Problema Produtor-Consumidor</h1>
          <p>Simulação em tempo real do clássico problema de sincronização</p>
        </header>

        <div className="pc-grid">
          <div className="pc-left-column">
            <section className="pc-card pc-controls">
              <h2>Controles da Simulação</h2>
              <p className="pc-subtitle">Configure os parâmetros da simulação</p>

              <label>Número de Producers: {producers}</label>
              <input type="range" min="1" max="5" value={producers} onChange={e => setProducers(+e.target.value)} disabled={isRunning} />

              <label>Número de Consumers: {consumers}</label>
              <input type="range" min="1" max="5" value={consumers} onChange={e => setConsumers(+e.target.value)} disabled={isRunning} />

              <label>Tamanho do Buffer: {bufferSize}</label>
              <input type="range" min="1" max="10" value={bufferSize} onChange={e => setBufferSize(+e.target.value)} disabled={isRunning} />

              <div className="pc-buttons">
                <button className="pc-btn-start" onClick={handleStart} disabled={isRunning}>▶ Iniciar</button>
                <button className="pc-btn-reset" onClick={handleReset}>⟳</button>
              </div>
            </section>

            <section className="pc-card pc-stats">
              <h2>Estatísticas</h2>
              <ul>
                <li>Itens produzidos: <span className="pc-circle pc-gray">{stats.produced}</span></li>
                <li>Itens consumidos: <span className="pc-circle pc-gray">{stats.consumed}</span></li>
                <li>Eventos de Buffer Cheio: <span className="pc-circle pc-red">{stats.bufferFull}</span></li>
                <li>Eventos de Buffer Vazio: <span className="pc-circle pc-red">{stats.bufferEmpty}</span></li>
                <li>Utilização do Buffer: <span className="pc-circle pc-gray">{Math.round((buffer.length / bufferSize) * 100)}%</span></li>
              </ul>
            </section>

            <section className="pc-card pc-explanation">
              <h2>Explicação do Algoritmo</h2>
              <p><strong>Producers</strong> geram itens e os adicionam ao buffer compartilhado. Eles são bloqueados quando o buffer está cheio.</p>
              <p><strong>Consumers</strong> removem itens do buffer para processamento. Eles são bloqueados quando o buffer está vazio.</p>
              <p><strong>Synchronization</strong> previne condições de corrida (*race conditions*) e garante a integridade dos dados entre producers e consumers.</p>
            </section>
          </div>

          <div className="pc-right-column">
            <section className="pc-card pc-buffer">
              <h2>Estado do Buffer</h2>
              <p>Conteúdo atual do buffer ({buffer.length}/{bufferSize})</p>
              <div className="pc-buffer-boxes">
                {[...Array(bufferSize)].map((_, i) => (
                  <div key={i} className={`pc-buffer-slot ${i < buffer.length ? 'filled' : ''}`}>
                    {i < buffer.length ? `#${buffer[i].id.toString().slice(-3)} P${buffer[i].producerId}` : '-'}
                  </div>
                ))}
              </div>

              <div className="pc-legend">
                <div className="pc-legend-group">
                  <h4>Producers</h4>
                  {[...Array(producers)].map((_, i) => (
                    <div key={i} className="pc-legend-item pc-producer">Producer {i + 1}</div>
                  ))}
                </div>
                <div className="pc-legend-group">
                  <h4>Consumers</h4>
                  {[...Array(consumers)].map((_, i) => (
                    <div key={i} className="pc-legend-item pc-consumer">Consumer {i + 1}</div>
                  ))}
                </div>
              </div>
            </section>

            <section className="pc-card pc-log">
              <h2>Registro de Atividades</h2>
              <p className="pc-subtitle">Eventos gerados durante a simulação em tempo real</p>
              <div className="pc-log-box">
                {logs.length === 0 ? (
                  <p>Inicie a simulação para visualizar os eventos</p>
                ) : (
                  logs.slice().reverse().map((log, i) => (
                    <div key={i} className={`pc-log-line ${log.type}`}>[{log.timestamp}] {log.msg}</div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
