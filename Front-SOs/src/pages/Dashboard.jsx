// Importa os hooks e componentes necessários do React e da aplicação
import React, { useState } from "react";
import './Dashboard.css'; // Importa os estilos CSS personalizados do Dashboard
import Navbar from "../components/NavBar"; // Componente de navegação superior
import { useNavigate } from 'react-router-dom'; // Hook para navegação entre rotas

// Função principal do componente Dashboard
function Dashboard() {
  // Estado para armazenar qual opção foi selecionada
  const [selected, setSelected] = useState(null);
  // Hook para navegação programática
  const navigate = useNavigate();

  // Lista de opções disponíveis no dashboard com título, descrição e rota
  const options = [
    {
      title: "SystemCalls",
      description: "Simule as principais chamadas de sistema: fork, execl, wait, open, read, write, e brk, mmap, munmap.",
      link: "/SystemCalls"
    },
    {
      title: "CPU/IO-Bound",
      description: "Simule processos CPU-bound e I/O-bound em tempo real, demonstrando seu comportamento no sistema.",
      link: "/CPU_IO_Bound"
    },
    {
      title: "ProdutorConsumidor",
      description: "Simule o clássico problema do Produtor-Consumidor com interação em tempo real. Acompanhe visualmente o estado do buffer e ajuste dinamicamente o número de produtores, consumidores e o tamanho do buffer para observar diferentes comportamentos.",
      link: "/ProducerConsumer"
    },
    {
      title: "GerenciamentoDeMemoria",
      description: "Simule o gerenciamento de memória com paginação configurando tamanho de páginas, número de quadros e algoritmos de substituição (FIFO, LRU, etc.). Visualize em tempo real o estado da memória e o comportamento do simulador.",
      link: "/VirtualMemory"
    }
  ];

  return (
    <>
      {/* Barra de navegação no topo da página */}
      <Navbar />

      <div className="menu-container">
        {/* Título e subtítulo de boas-vindas */}
        <h1 className="welcome-title">Boas-vindas!!</h1>
        <p className="welcome-subtitle">
          Seu lugar para aprender sobre conceitos de Sistemas Operacionais
        </p>

        {/* Grid de cards com as opções de simulação */}
        <div className="card-grid">
          {options.map((option, index) => (
            <div
              key={index}
              className={'card'} // Classe CSS usada para estilizar o card
            >
              {/* Título e descrição do card */}
              <h3 className="card-title">{option.title}</h3>
              <p className="card-description">{option.description}</p>

              {/* Botão para iniciar simulação correspondente */}
              <button
                className="card-button"
                onClick={() => {
                  setSelected(option.title); // Atualiza qual opção foi selecionada
                  navigate(option.link);     // Navega para a página da simulação
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

// Exporta o componente para uso em outras partes da aplicação
export default Dashboard;
