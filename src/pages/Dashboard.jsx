import React, { useState } from "react";
import './Dashboard.css';
import Navbar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const options = [
    {
      title: "SystemCalls",
      description: "Simule as principais chamadas de sistema: fork, execl, wait, open, read, write, e brk, mmap, munmap."
    },
    {
      title: "CPU_IO_Bound",
      description: "Simule processos CPU-bound e I/O-bound em tempo real, demonstrando seu comportamento no sistema."
    },
    {
      title: "ProdutorConsumidor",
      description: "Simule o clássico problema do Produtor-Consumidor com interação em tempo real. Acompanhe visualmente o estado do buffer e ajuste dinamicamente o número de produtores, consumidores e o tamanho do buffer para observar diferentes comportamentos."
    },
    {
      title: "GerenciamentoDeMemoria",
      description: "Simule o gerenciamento de memória com paginação configurando tamanho de páginas, número de quadros e algoritmos de substituição (FIFO, LRU, etc.). Visualize em tempo real o estado da memória e o comportamento do simulador."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="menu-container">
        <h1 className="welcome-title">Boas-vindas, aaaaa!</h1>
        <p className="welcome-subtitle">
          Seu lugar para aprender sobre conceitos de Sistemas Operacionais
        </p>

        <div className="card-grid">
          {options.map((option, index) => (
            <div
              key={index}
              className={'card'}
            >
              <h3 className="card-title">{option.title}</h3>
              <p className="card-description">{option.description}</p>
              <button
                    className="card-button"
                    onClick={() => {
                      setSelected(option.title);
                      navigate(`/${option.title}`);
                    }}
                  >
                    Start Learning
                  </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
