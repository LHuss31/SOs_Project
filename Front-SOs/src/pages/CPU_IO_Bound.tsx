import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/card';
import { Button } from '../components/button';
import { Badge } from '../components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/select';
import { Play, Pause, RotateCcw, Upload } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './CPU_IO_Bound.css'; // certifique-se de criar esse CSS com os estilos correspondentes

const CPU_IO_Bounds = () => {
  const [selectedProgram, setSelectedProgram] = useState('cpu-intensive');
  const [isRunning, setIsRunning] = useState(false);
  const [cpuData, setCpuData] = useState<{ time: number; cpu: number; io: number }[]>([]);
  const [ioData, setIoData] = useState([]);
  const [processStats, setProcessStats] = useState({
    cpuTime: 0,
    ioWaitTime: 0,
    totalTime: 0,
    contextSwitches: 0,
  });

  const programs = {
   'cpu-intensive': {
      name: 'CPU-Intensive Program',
      type: 'CPU-bound',
      code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <math.h>
#include <time.h>

// Verifica se um número é primo
int eh_primo(long num) {
    if (num < 2) return 0; // Números menores que 2 não são primos
    for (long i = 2; i * i <= num; i++) { // Verifica divisibilidade até a raiz quadrada do número
        if (num % i == 0) return 0; // Se for divisível, não é primo
    }
    return 1; // Se passou sem encontrar divisores, é primo
}

// Função CPU-bound: busca pares de primos gêmeos dentro de um limite
void cpu_bound() {
    long num = 100000; // Limite superior da busca
    int count = 0; // Contador de primos gêmeos

    for (long i = 2; i < num; i++) {
        if (eh_primo(i) && eh_primo(i + 2)) { // Verifica se i e i+2 são primos
            count++; // Incrementa o contador se for um par de primos gêmeos
        }
    }
    printf("Total primos gêmeos encontrados: %d\n", count);
}

int main() {
    clock_t start, end;
    double cpu_time_used;

    printf("Iniciando processo CPU-bound\n");
    start = clock(); // Início
    cpu_bound(); // Executa a função que consome CPU
    end = clock(); // Fim

    // Calcula e exibe o tempo de execução
    cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("Tempo do processo CPU-bound: %f segundos\n", cpu_time_used);

    return 0;
}`,
      description: 'Performs intensive mathematical calculations using mostly CPU resources.'
    },
    'io-intensive': {
      name: 'I/O-Intensive Program',
      type: 'I/O-bound',
      code: `#include <fcntl.h>   // inclui open() e flags como O_CREAT, O_WRONLY etc.
#include <unistd.h>  // inclui close(), read(), write()
#include <stdio.h>
#include <string.h>

int main() {
    int fd; // File Descriptor
    char mensagem[] = "Escrevendo com write()!\n";
    char buffer[128];
    ssize_t bytesLidos;

    // -------- ABRIR OU CRIAR ARQUIVO --------
    // O_WRONLY: abre para escrita; O_CREAT: cria se não existir; 0644: permissões
    fd = open("arquivo.txt", O_CREAT | O_WRONLY, 0644);
    if (fd == -1) {
        perror("Erro ao abrir/criar o arquivo");
        return 1;
    }

    printf("Arquivo aberto/criado com sucesso! FD: %d\n", fd);
    close(fd); // Fecha o arquivo

    // -------- ESCREVER NO ARQUIVO --------
    fd = open("arquivo.txt", O_WRONLY | O_APPEND);
    if (fd == -1) {
        perror("Erro ao abrir o arquivo para escrita");
        return 1;
    }

    if (write(fd, mensagem, strlen(mensagem)) == -1) {
        perror("Erro ao escrever no arquivo");
        close(fd);
        return 1;
    }

    printf("Mensagem escrita com sucesso.\n");
    close(fd); // Fecha o arquivo após escrita

    // -------- LER O ARQUIVO --------
    fd = open("arquivo.txt", O_RDONLY);
    if (fd == -1) {
        perror("Erro ao abrir o arquivo para leitura");
        return 1;
    }

    bytesLidos = read(fd, buffer, sizeof(buffer) - 1);
    if (bytesLidos == -1) {
        perror("Erro ao ler o arquivo");
        close(fd);
        return 1;
    }

    buffer[bytesLidos] = '\0'; // Garante que o buffer seja uma string válida
    printf("Conteúdo lido do arquivo:\n%s", buffer);

    close(fd); // Fecha o arquivo após leitura
    return 0;
}`,
      description: 'Performs frequent file operations, spending most time waiting for I/O.'
    },
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        const currentProgram = programs[selectedProgram];
        const time = Date.now();

        let cpuUsage, ioUsage;
        if (currentProgram.type === 'CPU-bound') {
          cpuUsage = 80 + Math.random() * 15;
          ioUsage = 5 + Math.random() * 10;
        } else if (currentProgram.type === 'I/O-bound') {
          cpuUsage = 10 + Math.random() * 15;
          ioUsage = 70 + Math.random() * 20;
        } else {
          cpuUsage = 30 + Math.random() * 40;
          ioUsage = 25 + Math.random() * 30;
        }

        setCpuData(prev => {
          const newData = [...prev, { time: time, cpu: cpuUsage, io: ioUsage }];
          return newData.slice(-20);
        });

        setProcessStats(prev => ({
          cpuTime: prev.cpuTime + (cpuUsage / 100),
          ioWaitTime: prev.ioWaitTime + (ioUsage / 100),
          totalTime: prev.totalTime + 1,
          contextSwitches: prev.contextSwitches + Math.floor(Math.random() * 3),
        }));
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isRunning, selectedProgram]);

  const handleRunProgram = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setCpuData([]);
    setIoData([]);
    setProcessStats({
      cpuTime: 0,
      ioWaitTime: 0,
      totalTime: 0,
      contextSwitches: 0,
    });
  };

  const currentProgram = programs[selectedProgram];

  return (
    <div className="cpuio-container">
      <div className="cpuio-wrapper">
        <div className="header">
          <h1 className="title">Process Management</h1>
          <p className="subtitle">
            Analyze CPU-bound and I/O-bound processes with real-time visualization
          </p>
        </div>

        <div className="cpuio-layout">
          {/* Controls */}
          <div className="cpuio-controls">
            <Card>
              <CardHeader>
                <CardTitle>Program Selection</CardTitle>
                <CardDescription>Choose a program to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(programs).map(([key, program]) => (
                      <SelectItem key={key} value={key}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="program-type">
                  <span className="label">Type:</span>
                  <Badge variant={
                    currentProgram.type === 'CPU-bound' ? 'destructive' :
                    currentProgram.type === 'I/O-bound' ? 'default' : 'secondary'
                  }>
                    {currentProgram.type}
                  </Badge>
                </div>
                <p className="description">
                  {currentProgram.description}
                </p>

                <div className="button-group">
                  <Button onClick={handleRunProgram}>
                    {isRunning ? <Pause className="icon" /> : <Play className="icon" />}
                    {isRunning ? 'Pause' : 'Run'}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="icon" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Process Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-item">
                  <span>CPU Time:</span>
                  <span className="monospace">{processStats.cpuTime.toFixed(1)}s</span>
                </div>
                <div className="stat-item">
                  <span>I/O Wait Time:</span>
                  <span className="monospace">{processStats.ioWaitTime.toFixed(1)}s</span>
                </div>
                <div className="stat-item">
                  <span>Total Time:</span>
                  <span className="monospace">{processStats.totalTime}s</span>
                </div>
                <div className="stat-item">
                  <span>Context Switches:</span>
                  <span className="monospace">{processStats.contextSwitches}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Custom Program</CardTitle>
                <CardDescription>Upload your own C program to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="upload-button">
                  <Upload className="icon" />
                  Upload File
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <div className="visualization-column">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Resource Usage</CardTitle>
                <CardDescription>CPU and I/O utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="cpuio-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cpuData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                        formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name === 'cpu' ? 'CPU Usage' : 'I/O Usage']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#ef4444" name="CPU Usage" strokeWidth={2} />
                      <Line type="monotone" dataKey="io" stroke="#3b82f6" name="I/O Usage" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="code">
              <TabsList className="tabs-list">
                <TabsTrigger value="code">Source Code</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="code">
                <Card>
                  <CardHeader>
                    <CardTitle>{currentProgram.name}</CardTitle>
                    <CardDescription>Source code being analyzed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="cpuio-code-block">
                      <code>{currentProgram.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding process behavior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="analysis-section">
                      <h4>Process Characteristics:</h4>
                      <ul>
                        {/* lógica de conteúdo já existente */}
                      </ul>
                    </div>
                    <div className="analysis-section">
                      <h4>Optimization Strategies:</h4>
                      <ul>
                        {/* lógica de conteúdo já existente */}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPU_IO_Bounds;





 