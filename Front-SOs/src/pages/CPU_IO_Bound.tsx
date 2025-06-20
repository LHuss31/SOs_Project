import React, { useState, useEffect } from 'react';
import './CPU_IO_Bound.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import NavBar from '../components/NavBar';

type Mode = 'cpu' | 'io';

interface ResourceMonitorProps {
  title: string;
  description: string;
  mode: Mode;
}

interface ChartData {
  time: number;
  cpu: number;
  io: number;
}

function ResourceMonitor({ title, description, mode }: ResourceMonitorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const time = Date.now();
      let cpu: number, io: number;

      if (mode === 'cpu') {
        cpu = 80 + Math.random() * 20;
        io = 5 + Math.random() * 10;
      } else {
        cpu = 10 + Math.random() * 15;
        io = 80 + Math.random() * 20;
      }

      setData((prev) => [...prev.slice(-19), { time, cpu, io }]);
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const reset = () => {
    setData([]);
    setIsRunning(false);
  };

  return (
    <div className="monitor-card">
      <div className="monitor-content">
        <div className="monitor-info">
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="button-group">
            <button onClick={() => setIsRunning(true)}>▶ Iniciar</button>
            <button onClick={() => setIsRunning(false)}>⏸ Pausar</button>
            <button onClick={reset}>⟳ Reiniciar</button>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                tickFormatter={(time) =>
                  new Date(time as number).toLocaleTimeString()
                }
              />
              <YAxis domain={[0, 100]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(val) =>
                  typeof val === 'number' ? `${val.toFixed(1)}%` : val
                }
                labelFormatter={(label) =>
                  new Date(label as number).toLocaleTimeString()
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#ef4444"
                name="Uso da CPU"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="io"
                stroke="#3b82f6"
                name="Uso de I/O"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function CPU_IO_Bound() {
  return (
    <>
      <NavBar />
      <header className="bounds-header">
        <h1>Gerenciamento de Processos CPU/I/O-Bound</h1>
        <p>Visualize em tempo real a diferença entre processos com uso intensivo de CPU e de I/O</p>
      </header>
      <div className="app-container">
        <ResourceMonitor
          title="Programa CPU-bound"
          description="Este programa realiza cálculos intensivos, utilizando a maior parte dos recursos da CPU."
          mode="cpu"
        />
        <ResourceMonitor
          title="Programa I/O-bound"
          description="Este programa realiza operações frequentes de entrada/saída (I/O), passando a maior parte do tempo aguardando por essas operações."
          mode="io"
        />
      </div>
    </>
  );
}
