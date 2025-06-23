import React, { useState, useEffect, useRef } from "react"; // Importa hooks do React
import './ProducerConsumer.css'; // Importa o CSS da simulação
import NavBar from '../components/NavBar'; // Importa o componente de navegação

// Define o tipo de item no buffer, com um ID e o ID do produtor que o criou
type BufferItem = {
  id: number;
  producerId: number;
};

// Define o tipo de log que será registrado na simulação
type LogEntry = {
  timestamp: string;
  msg: string;
  type: 'info' | 'producer' | 'consumer' | 'blocked' | 'system';
};

// Componente principal da simulação do problema Produtor-Consumidor
export default function ProducerConsumer() {
  const [buffer, setBuffer] = useState<BufferItem[]>([]); // Estado do buffer compartilhado
  const [logs, setLogs] = useState<LogEntry[]>([]); // Estado do histórico de logs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Referência para o setInterval
  const [producers, setProducers] = useState(2); // Número de produtores ativos
  const [consumers, setConsumers] = useState(2); // Número de consumidores ativos
  const [bufferSize, setBufferSize] = useState(5); // Capacidade máxima do buffer
  const [isRunning, setIsRunning] = useState(false); // Se a simulação está em execução
  const [stats, setStats] = useState({ // Estatísticas da simulação
    produced: 0,
    consumed: 0,
    bufferFull: 0,
    bufferEmpty: 0
  });

  // Função auxiliar para registrar eventos no log
  const logEvent = (msg: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString(); // Gera timestamp atual
    setLogs(prev => [...prev.slice(-49), { timestamp, msg, type }]); // Mantém no máximo 50 logs
  };

  // Tenta adicionar um item no buffer
  const addToBuffer = (item: BufferItem) => {
    setBuffer(prev => {
      if (prev.length < bufferSize) {
        logEvent(`Producer ${item.producerId} added item ${item.id}`, 'producer'); // Log de produção
        setStats(s => ({ ...s, produced: s.produced + 1 })); // Atualiza estatísticas
        return [...prev, item]; // Adiciona item
      } else {
        logEvent(`Producer ${item.producerId} blocked - buffer full`, 'blocked'); // Log de bloqueio
        setStats(s => ({ ...s, bufferFull: s.bufferFull + 1 })); // Atualiza estatísticas
        return prev; // Não altera buffer
      }
    });
  };

  // Tenta remover um item do buffer
  const removeFromBuffer = (consumerId: number) => {
    setBuffer(prev => {
      if (prev.length > 0) {
        const item = prev[0]; // Primeiro item do buffer
        logEvent(`Consumer ${consumerId} consumed item ${item.id}`, 'consumer'); // Log de consumo
        setStats(s => ({ ...s, consumed: s.consumed + 1 })); // Atualiza estatísticas
        return prev.slice(1); // Remove o item
      } else {
        logEvent(`Consumer ${consumerId} blocked - buffer empty`, 'blocked'); // Log de bloqueio
        setStats(s => ({ ...s, bufferEmpty: s.bufferEmpty + 1 })); // Atualiza estatísticas
        return prev; // Não altera buffer
      }
    });
  };

  // Efeito que controla a execução da simulação
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Laço de produtores
        for (let i = 0; i < producers; i++) {
          if (Math.random() < 0.7) { // 70% de chance de produzir
            const item: BufferItem = {
              id: Date.now() + Math.random(), // ID único
              producerId: i + 1, // ID do produtor
            };
            addToBuffer(item); // Tenta adicionar ao buffer
          }
        }

        // Laço de consumidores
        for (let i = 0; i < consumers; i++) {
          if (Math.random() < 0.6) { // 60% de chance de consumir
            removeFromBuffer(i + 1); // Tenta remover do buffer
          }
        }
      }, 1000); // Executa a cada 1 segundo
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Para o intervalo se não estiver rodando
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Limpa intervalo ao desmontar
      }
    };
  }, [isRunning, producers, consumers, bufferSize]); // Roda o efeito ao mudar esses valores

  // Inicia a simulação
  const handleStart = () => {
    setIsRunning(true);
    logEvent('Simulação iniciada', 'system');
  };

  // Reseta a simulação
  const handleReset = () => {
    setIsRunning(false);
    setBuffer([]);
    setStats({ produced: 0, consumed: 0, bufferFull: 0, bufferEmpty: 0 });
    setLogs([]);
    logEvent('Simulação reiniciada', 'system');
  };

  return (
    <>
      <NavBar /> {/* Barra de navegação */}
      <div className="pc-page">
        <header className="pc-header">
          <h1>Problema Produtor-Consumidor</h1>
          <p>Simulação em tempo real do clássico problema de sincronização</p>
        </header>

        <div className="pc-grid">
          <div className="pc-left-column">
            {/* Controles da simulação */}
            <section className="pc-card pc-controls">
              <h2>Controles da Simulação</h2>
              <p className="pc-subtitle">Configure os parâmetros da simulação</p>

              {/* Controle de número de produtores */}
              <label>Número de Producers: {producers}</label>
              <input type="range" min="1" max="5" value={producers} onChange={e => setProducers(+e.target.value)} disabled={isRunning} />

              {/* Controle de número de consumidores */}
              <label>Número de Consumers: {consumers}</label>
              <input type="range" min="1" max="5" value={consumers} onChange={e => setConsumers(+e.target.value)} disabled={isRunning} />

              {/* Controle de tamanho do buffer */}
              <label>Tamanho do Buffer: {bufferSize}</label>
              <input type="range" min="1" max="10" value={bufferSize} onChange={e => setBufferSize(+e.target.value)} disabled={isRunning} />

              {/* Botões de controle */}
              <div className="pc-buttons">
                <button className="pc-btn-start" onClick={handleStart} disabled={isRunning}>▶ Iniciar</button>
                <button className="pc-btn-reset" onClick={handleReset}>⟳</button>
              </div>
            </section>

            {/* Estatísticas da simulação */}
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

            {/* Explicação do algoritmo */}
            <section className="pc-card pc-explanation">
              <h2>Explicação do Algoritmo</h2>
              <p><strong>Producers</strong> geram itens e os adicionam ao buffer compartilhado. Eles são bloqueados quando o buffer está cheio.</p>
              <p><strong>Consumers</strong> removem itens do buffer para processamento. Eles são bloqueados quando o buffer está vazio.</p>
              <p><strong>Synchronization</strong> previne condições de corrida (*race conditions*) e garante a integridade dos dados entre producers e consumers.</p>
            </section>
          </div>

          {/* Coluna da direita: visualização do buffer e log */}
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

              {/* Legenda dos produtores e consumidores */}
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

            {/* Log de atividades */}
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
