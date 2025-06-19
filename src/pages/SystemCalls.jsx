import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "./SystemCallsPage.css";

const systemCalls = [
  { name: "fork()", description: "Cria um novo processo duplicando o processo atual", type: "Processo" },
  { name: "open()", description: "Abre um arquivo e retorna um descritor de arquivo", type: "Entrada/Saída" },
  { name: "malloc()", description: "Aloca memória dinâmica na heap", type: "Memória" },
  { name: "read()", description: "Lê dados de um descritor de arquivo", type: "Entrada/Saída" },
  { name: "write()", description: "Escreve dados em um descritor de arquivo", type: "Entrada/Saída" },
  { name: "exec()", description: "Substitui o processo atual por uma nova imagem de programa", type: "Processo" },
  { name: "wait()", description: "Aguarda a finalização de um processo filho", type: "Processo" },
];

const codeExample = `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Processo filho: PID = %d\\n", getpid());
    } else if (pid > 0) {
        printf("Processo pai: PID = %d, PID do filho = %d\\n", getpid(), pid);
        wait(NULL);
    } else {
        perror("fork falhou");
    }
    return 0;
}`;

const explanationText = `A chamada de sistema fork() cria um novo processo duplicando o processo atual.
O valor de retorno difere entre pai e filho:
- 0 no processo filho
- PID positivo no processo pai
- -1 em caso de erro`;

const outputExample = `Processo pai: PID = 12345, PID do filho = 12346
Processo filho: PID = 12346`;

export default function SystemCallsExplorer() {
  const [selected, setSelected] = useState("fork()");
  const [activeTab, setActiveTab] = useState("Code");

  const renderContent = () => {
    if (activeTab === "Code") {
      return <pre>{codeExample}</pre>;
    } else if (activeTab === "Explanation") {
      return <pre>{explanationText}</pre>;
    } else if (activeTab === "Output") {
      return <pre>{outputExample}</pre>;
    }
  };

  return (
    <div className="system-calls-container">
      <NavBar />
      <header className="system-calls-header">
        <h1>Explorador de Chamadas de Sistema</h1>
        <p>Explore chamadas de sistema essenciais com exemplos interativos de código</p>
      </header>

      <div className="system-calls-content">
        <aside className="system-calls-sidebar">
          <h2>Chamadas de Sistema</h2>
          <p>Clique em uma chamada para explorar</p>

          {systemCalls.map((call) => (
            <div
              key={call.name}
              className={`system-calls-card ${selected === call.name ? "selected" : "unselected"}`}
              onClick={() => setSelected(call.name)}
            >
              <div className="system-calls-card-header">
                <span className="system-calls-title">{call.name}</span>
                <span className="system-calls-type">{call.type}</span>
              </div>
              <div className="system-calls-description">{call.description}</div>
            </div>
          ))}
        </aside>

        <main className="system-calls-main-content">
          <div className="system-calls-call-header">
            <h3>{selected}</h3>
            <span>{systemCalls.find((c) => c.name === selected).description}</span>
          </div>

          <div className="system-calls-tabs">
            <div className={`system-calls-tab ${activeTab === "Code" ? "active" : ""}`} onClick={() => setActiveTab("Code")}>Código</div>
            <div className={`system-calls-tab ${activeTab === "Explanation" ? "active" : ""}`} onClick={() => setActiveTab("Explanation")}>Explicação</div>
            <div className={`system-calls-tab ${activeTab === "Output" ? "active" : ""}`} onClick={() => setActiveTab("Output")}>Saída</div>
          </div>

          <div className="system-calls-code-box">
            {renderContent()}
          </div>

          <button className="system-calls-compile-btn">▶ Compilar & Executar</button>
        </main>
      </div>
    </div>
  );
}
