import React, { useState } from "react";

function Dashboard(){
    const [selected, setSelected] = useState(null);

    const options = [
        {title: "System Calls", description: "Simule as principais chamadas de sistema: fork, execl, wait, open, read, write, e brk, mmap, munmap."},
        {title: "CPU/IO-Bound", description: "Simule processos CPU-bound e I/O-bound em tempo real, demonstrando seu comportamento no sistema."},
        {title: "Produtor-Consumidor", description: "Simule o clássico problema do Produtor-Consumidor com interação em tempo real. Acompanhe visualmente o estado do buffer e ajuste dinamicamente o número de produtores, consumidores e o tamanho do buffer para observar diferentes comportamentos."},
        {title: "Gerenciamento de Memória", description: "Simule o gerenciamento de memória com paginação configurando tamanho de páginas, número de quadros e algoritmos de substituição (FIFO, LRU, etc.). Visualize em tempo real o estado da memória e o comportamento do simulador."},
    ];

     return (
    <div className="menu-container">
      <h2 className="menu-title">Menu</h2>
      <div className="card-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={'card ${selected === option.title ? "selected" : ""}'}
            onClick={() => setSelected(option.title)}
          >
            <h3 className="card-title">{option.title}</h3>
            <p className="card-description">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
