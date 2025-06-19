import React, { useState } from "react";
import './ProducerConsumer.css';
import NavBar from '../components/NavBar';

export default function ProducerConsumer() {
  const [producers, setProducers] = useState(2);
  const [consumers, setConsumers] = useState(2);
  const [bufferSize, setBufferSize] = useState(5);

  return (
    <>
      <NavBar />
      <div className="pc-page">
        <header className="pc-header">
          <h1>Problema Produtor-Consumidor</h1>
          <p>Simulação em tempo real do clássico problema de sincronização</p>
        </header>

        <div className="pc-grid">
          {/* Coluna esquerda */}
          <div className="pc-left-column">
            <section className="pc-card pc-controls">
              <h2>Controles da Simulação</h2>
              <p className="pc-subtitle">Configure os parâmetros da simulação</p>

              <label>Número de Producers: {producers}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={producers}
                onChange={(e) => setProducers(parseInt(e.target.value))}
              />

              <label>Número de Consumers: {consumers}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={consumers}
                onChange={(e) => setConsumers(parseInt(e.target.value))}
              />

              <label>Tamanho do Buffer: {bufferSize}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={bufferSize}
                onChange={(e) => setBufferSize(parseInt(e.target.value))}
              />

              <div className="pc-buttons">
                <button className="pc-btn-start">▶ Iniciar</button>
                <button className="pc-btn-reset">⟳</button>
              </div>
            </section>

            <section className="pc-card pc-stats">
              <h2>Estatísticas</h2>
              <ul>
                <li>Itens produzidos: <span className="pc-circle pc-gray">0</span></li>
                <li>Itens consumidos: <span className="pc-circle pc-gray">0</span></li>
                <li>Eventos de Buffer Cheio: <span className="pc-circle pc-red">0</span></li>
                <li>Eventos de Buffer Vazio: <span className="pc-circle pc-red">0</span></li>
                <li>Utilização do Buffer: <span className="pc-circle pc-gray">0%</span></li>
              </ul>
            </section>

            <section className="pc-card pc-explanation">
              <h2>Explicação do Algoritmo</h2>
              <p><strong>Producers</strong> geram itens e os adicionam ao buffer compartilhado. Eles são bloqueados quando o buffer está cheio.</p>
              <p><strong>Consumers</strong> removem itens do buffer para processamento. Eles são bloqueados quando o buffer está vazio.</p>
              <p><strong>Synchronization</strong> previne condições de corrida (*race conditions*) e garante a integridade dos dados entre producers e consumers.</p>
            </section>
          </div>

          {/* Coluna direita (agrupando buffer + log) */}
          <div className="pc-right-column">
            <section className="pc-card pc-buffer">
              <h2>Estado do Buffer</h2>
              <p>Conteúdo atual do buffer (0/{bufferSize})</p>
              <div className="pc-buffer-boxes">
                {[...Array(bufferSize)].map((_, i) => (
                  <div key={i} className="pc-buffer-slot">-</div>
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
                <p>Inicie a simulação para visualizar os eventos</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
