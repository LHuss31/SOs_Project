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
        <h1>Virtual Memory Management</h1>
        <p>Visualize page replacement algorithms and virtual memory concepts</p>
      </header>

      <div className="vm-page-content">
        <div className="vm-left-panel">
          <div className="vm-config-card">
            <h2>Configuration</h2>
            <p className="vm-config-subtitle">Set up memory management parameters</p>

            <div className="vm-config-item">
              <label>Page Size: {pageSize} KB</label>
              <input type="range" min="1" max="20" value={pageSize} onChange={(e) => setPageSize(e.target.value)} />
            </div>

            <div className="vm-config-item">
              <label>Number of Frames: {frames}</label>
              <input type="range" min="0" max="7" value={frames} onChange={(e) => setFrames(e.target.value)} />
            </div>

            <div className="vm-config-item">
              <label>Replacement Algorithm</label>
              <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
                <option value="FIFO">FIFO - First In, First Out</option>
                <option value="LRU">LRU - Least Recently Used</option>
                <option value="LFU">LFU - Least Frequently Used</option>
              </select>
            </div>

            <button className="vm-play-button">▶ Auto Play</button>
            <button className="vm-reset-button">⟳ Reset</button>
          </div>

          <div className="vm-stats-card">
            <h2>Statistics</h2>
            <div className="vm-stat-item">
              <span>Page Faults:</span>
              <span className="vm-fault-value">0</span>
            </div>
            <div className="vm-stat-item">
              <span>Page Hits:</span>
              <span className="vm-stat-badge">0</span>
            </div>
            <div className="vm-stat-item">
              <span>Hit Ratio:</span>
              <span className="vm-stat-badge">0%</span>
            </div>
            <div className="vm-stat-item">
              <span>Current Step:</span>
              <span className="vm-stat-badge">0/18</span>
            </div>
          </div>
        </div>

        <div className="vm-right-panel">
          <div className="vm-memory-card">
            <h2>Current Memory State</h2>
            <p className="vm-memory-subtitle">Page frames in physical memory</p>

            <div className="vm-memory-frames">
              {frameArray.map((frame, index) => (
                <div key={index} className="vm-memory-frame">
                  <span className="vm-frame-title">Frame {frame}</span>
                  <div className="vm-frame-box">-</div>
                </div>
              ))}
            </div>

            <div className="vm-memory-legend">
              <div className="vm-legend vm-legend-new">
                <div className="vm-legend-box"></div> Newly loaded page
              </div>
              <div className="vm-legend vm-legend-replaced">
                <div className="vm-legend-box"></div> Replaced page
              </div>
              <div className="vm-legend vm-legend-existing">
                <div className="vm-legend-box"></div> Existing page
              </div>
            </div>
          </div>

          {/* EXECUTION TIMELINE */}
          <div className="vm-timeline-card">
            <h2>Execution Timeline</h2>
            <p className="vm-timeline-subtitle">Step-by-step page replacement process</p>

            <div className="vm-timeline-header">
              <div>Step</div>
              <div>Page</div>
              <div>Frames</div>
              <div>Fault</div>
            </div>

            {/* Aqui futuramente o backend irá popular */}
            <div className="vm-timeline-row">
              <div>1</div>
              <div>5</div>
              <div>1 3 5 6</div>
              <div><span className="vm-timeline-fault">Yes</span></div>
            </div>
            <div className="vm-timeline-row">
              <div>2</div>
              <div>3</div>
              <div>1 3 5 6</div>
              <div><span className="vm-timeline-hit">No</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
