import React, { useState } from 'react';
import NavBar from "../components/NavBar";
import "./VirtualMemoryPage.css";

export default function VirtualMemoryPage() {
  const [pageSize, setPageSize] = useState(10);
  const [frames, setFrames] = useState(7);
  const [algorithm, setAlgorithm] = useState("LRU");

  const frameArray = Array.from({ length: parseInt(frames) + 1 }, (_, i) => i);

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
              <input type="range" min="1" max="20" value={pageSize} onChange={(e) => setPageSize(e.target.value)} />
            </div>

            <div className="vm-config-item">
              <label>Número de Quadros (Frames): {frames}</label>
              <input type="range" min="0" max="7" value={frames} onChange={(e) => setFrames(e.target.value)} />
            </div>

            <div className="vm-config-item">
              <label>Algoritmo de Substituição</label>
              <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                <option value="FIFO">FIFO - First In, First Out (Primeiro a Entrar, Primeiro a Sair)</option>
                <option value="LRU">LRU - Least Recently Used (Menos Recentemente Usado)</option>
                <option value="LFU">LFU - Least Frequently Used (Menos Frequentemente Usado)</option>
              </select>
            </div>

            <button className="vm-play-button">▶ Executar Automaticamente</button>
            <button className="vm-reset-button">⟳ Reiniciar</button>
          </div>

          <div className="vm-stats-card">
            <h2>Estatísticas</h2>
            <div className="vm-stat-item">
              <span>Page Faults (Faltas de Página):</span>
              <span className="vm-fault-value">0</span>
            </div>
            <div className="vm-stat-item">
              <span>Page Hits (Acertos de Página):</span>
              <span className="vm-stat-badge">0</span>
            </div>
            <div className="vm-stat-item">
              <span>Taxa de Acerto:</span>
              <span className="vm-stat-badge">0%</span>
            </div>
            <div className="vm-stat-item">
              <span>Etapa Atual:</span>
              <span className="vm-stat-badge">0/18</span>
            </div>
          </div>
        </div>

        <div className="vm-right-panel">
          <div className="vm-memory-card">
            <h2>Estado Atual da Memória</h2>
            <p className="vm-memory-subtitle">Quadros de página na memória física</p>

            <div className="vm-memory-frames">
              {frameArray.map((frame, index) => (
                <div key={index} className="vm-memory-frame">
                  <span className="vm-frame-title">Quadro {frame}</span>
                  <div className="vm-frame-box">-</div>
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
                <div className="vm-legend-box"></div> Página existente
              </div>
            </div>
          </div>

          {/* LINHA DO TEMPO DE EXECUÇÃO */}
          <div className="vm-timeline-card">
            <h2>Linha do Tempo da Execução</h2>
            <p className="vm-timeline-subtitle">Processo passo a passo de substituição de páginas</p>

            <div className="vm-timeline-header">
              <div>Passo</div>
              <div>Página</div>
              <div>Quadros</div>
              <div>Falta</div>
            </div>

            {/* Simulação estática temporária */}
            <div className="vm-timeline-row">
              <div>1</div>
              <div>5</div>
              <div>1 3 5 6</div>
              <div><span className="vm-timeline-fault">Sim</span></div>
            </div>
            <div className="vm-timeline-row">
              <div>2</div>
              <div>3</div>
              <div>1 3 5 6</div>
              <div><span className="vm-timeline-hit">Não</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
