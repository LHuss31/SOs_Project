import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "./SystemCallsPage.css";

const systemCalls = [
  {
    name: "fork()",
    description: "Cria um novo processo duplicando o processo atual",
    type: "Processo",
    code: `#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdlib.h>
#include <sys/wait.h>

int main() {
    int pid;
    pid = fork();

    if (pid < 0) {
        fprintf(stderr, "Erro ao criar processo\n");
        exit(1);
    }

    if (pid == 0) {
        printf("FILHO:\t ID é %d, valor de pid é %d\n", getpid(), pid);
    } else {
        printf("PAI:\t ID é %d, pid (filho) é %d\n", getpid(), pid);
        wait(NULL);
    }

    system("date");

    return 0;
}`,
    explanation: `Cria um novo processo duplicando o processo atual.\n- Retorna 0 no processo filho\n- Retorna PID do filho no processo pai\n- Retorna -1 em caso de erro`
  },
  {
    name: "execl()",
    description: "Substitui o processo atual por outro programa",
    type: "Processo",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
    int pid;
    pid = fork();

    if (pid < 0) {
        fprintf(stderr, "Erro\n");
        exit(1);
    }
    if (pid == 0) {
        printf("FILHO:\t id é %d, pid (valor) é %d\n", getpid(), pid);
        printf("Processo filho executando exec()\n");
        execl("/bin/ls", "ls", "-l", NULL);
        perror("exec falhou");
        exit(1);
    } else {
        printf("PAI:\t id é %d, pid (filho) é %d\n", getpid(), pid);
        printf("Processo pai aguardando filho\n");
        wait(NULL);
        printf("Processo filho finalizado.\n");
    }
    system("date");
    return 0;
}`,
    explanation: `A chamada execl() substitui o processo atual por outro.\n- Usado junto com fork() para o processo filho executar outro programa.\n- Se exec falhar, retorna -1 e continua no processo filho.`
  },
  {
    name: "wait()",
    description: "Aguarda a finalização de um processo filho",
    type: "Processo",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <signal.h>
#include <sys/wait.h>

void meu_wait(pid_t pid) {
    int status;
    while (1) {
        pid_t result = waitpid(pid, &status, WNOHANG);
        if (result == pid) {
            printf("FILHO:\t Valor de pid é %d\n", pid);
            break;
        }
        usleep(1000);
    }
}

int main() {
    pid_t pid = fork();

    if (pid == -1) {
        perror("Erro");
        exit(1);
    }
    if (pid == 0) {
        printf("Filho iniciado (PID: %d)\n", getpid());
        sleep(3);
        printf("Filho finalizando\n");
        exit(0);
    } else {
        printf("Pai aguardando filho terminar\n");
        meu_wait(pid);
        printf("Pai detectou que o filho foi finalizado e continua sua execução.\n");
    }
    return 0;
}`,
    explanation: `A chamada wait() suspende a execução do processo pai até que o filho finalize.\n- waitpid() permite aguardar um processo específico\n- WNOHANG permite continuar se o processo filho ainda estiver em execução`
  },
  {
    name: "open()",
    description: "Abre um arquivo e retorna um descritor de arquivo",
    type: "Entrada/Saída",
    code: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main(){
    int fd;
    fd = open("arquivo_open.txt", O_CREAT | O_WRONLY, 0644);
    if(fd == -1){
        perror("Erro ao abrir/criar o arquivo");
        return 1;
    }
    printf("Arquivo aberto/criado com sucesso! FD: %d\n", fd);
    close(fd);
    return 0;
}`,
    explanation: `A chamada open() abre ou cria um arquivo.\n- O_CREAT: cria o arquivo se ele não existir\n- O_WRONLY: abre somente para escrita\n- Retorna um descritor de arquivo >= 0 ou -1 em erro.`
  },
  {
    name: "read()",
    description: "Lê dados de um descritor de arquivo",
    type: "Entrada/Saída",
    code: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    int fd;
    char buffer[128];
    ssize_t bytesLidos;

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

    buffer[bytesLidos] = '\0';
    printf("Conteúdo lido:\n%s", buffer);

    close(fd);
    return 0;
}`,
    explanation: `read() lê até N bytes de um descritor de arquivo e coloca no buffer.\n- Retorna número de bytes lidos ou -1 em caso de erro.`
  },
  {
    name: "write()",
    description: "Escreve dados em um descritor de arquivo",
    type: "Entrada/Saída",
    code: `#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main() {
    int fd;
    char mensagem[] = "Escrevendo com write()!\n";

    fd = open("arquivo.txt", O_WRONLY | O_CREAT | O_APPEND, 0644);
    if (fd == -1) {
        perror("Erro ao abrir o arquivo para escrita");
        return 1;
    }

    if (write(fd, mensagem, strlen(mensagem)) == -1) {
        perror("Erro ao escrever");
        close(fd);
        return 1;
    }

    printf("Mensagem escrita com sucesso.\n");

    close(fd);
    return 0;
}`,
    explanation: `A chamada write() escreve dados em um descritor de arquivo.\n- Retorna o número de bytes escritos\n- -1 em caso de erro (ex: arquivo não acessível ou cheio)`
  },
  {
    name: "sbrk()",
    description: "Aloca ou expande regiões de memória dinamicamente",
    type: "Memória",
    code: `#include <stdio.h>
#include <unistd.h>

int main() {
    void *heap_atual = sbrk(0); // Obtém o endereço atual do heap
    printf("Endereço inicial do heap: %p\n", heap_atual);

    // Expandindo o heap
    void *novo_heap = sbrk(4096); // Aumenta 4 KB
    if (novo_heap == (void *)-1) {
        perror("Erro ao expandir o heap");
        return 1;
    }

    printf("Novo endereço do heap: %p\n", sbrk(0));

    return 0;
}`,
    explanation: `A chamada sbrk() ajusta o topo do heap do processo.\n- sbrk(0): retorna o endereço atual do heap\n- sbrk(N): tenta expandir o heap em N bytes\n- Retorna -1 em caso de erro`
  },
  {
    name: "nmap()",
    description: "Mapeia e manipula uma região de memória virtual",
    type: "Memória",
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int main() {
    size_t tamanho = 4096; // 4 KB de memória a ser mapeada

    // Criando uma região de memória anônima (sem arquivo associado)
    void *ptr = mmap(NULL, tamanho, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);

    if (ptr == MAP_FAILED) {
        perror("Erro ao mapear memória");
        return 1;
    }

    // Escrevendo na memória mapeada
    strcpy(ptr, "Hello, mmap!");

    printf("Mensagem armazenada na memória mapeada: %s\n", (char *)ptr);

    // Liberando a memória mapeada
    munmap(ptr, tamanho);

    return 0;
}`,
    explanation: `A chamada mmap() cria uma região de memória mapeada.\n- MAP_ANONYMOUS: memória não associada a arquivo\n- PROT_READ | PROT_WRITE: permite leitura e escrita\n- Após o uso, é necessário liberar com munmap()`
  },
  {
    name: "munmap()",
    description: "Desfaz o mapeamento de uma região de memória",
    type: "Memória",
    code: `#include <stdio.h>
#include <sys/mman.h>
#include <unistd.h>

int main() {
    size_t tamanho = 4096; // 4 KB

    // Mapeia uma região de memória
    void *ptr = mmap(NULL, tamanho, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    
    if (ptr == MAP_FAILED) {
        perror("Erro ao mapear memória");
        return 1;
    }

    printf("Memória mapeada no endereço: %p\n", ptr);

    // Desmapeando a memória
    if (munmap(ptr, tamanho) == -1) {
        perror("Erro ao liberar memória");
        return 1;
    }

    printf("Memória liberada com sucesso.\n");

    return 0;
}`,
    explanation: `A chamada munmap() desfaz o mapeamento de uma região de memória previamente alocada com mmap().\n- É necessário passar o ponteiro e o tamanho da região\n- Retorna 0 em sucesso ou -1 em erro`
  }
];

export default function SystemCallsExplorer() {
  const [selected, setSelected] = useState("fork()");
  const [activeTab, setActiveTab] = useState("Code");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");

  const currentCall = systemCalls.find((c) => c.name === selected);

  const renderContent = () => {
    if (activeTab === "Code") return <pre>{currentCall.code}</pre>;
    if (activeTab === "Explanation") return <pre>{currentCall.explanation}</pre>;
    if (activeTab === "Output")
      return (
        <div>
          <pre><strong>stdout:</strong> {stdout}</pre>
          <pre><strong>stderr:</strong> {stderr}</pre>
        </div>
      );
  };

  const handleCompileAndRun = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/systemcalls/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: currentCall.code }),
      });

      const result = await response.json();
      setStdout(result.stdout || "");
      setStderr(result.stderr || "");
      setActiveTab("Output");
    } catch (err) {
      setStdout("");
      setStderr("Erro ao conectar com o backend.");
      setActiveTab("Output");
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
            <span>{currentCall.description}</span>
          </div>

          <div className="system-calls-tabs">
            <div className={`system-calls-tab ${activeTab === "Code" ? "active" : ""}`} onClick={() => setActiveTab("Code")}>Código</div>
            <div className={`system-calls-tab ${activeTab === "Explanation" ? "active" : ""}`} onClick={() => setActiveTab("Explanation")}>Explicação</div>
            <div className={`system-calls-tab ${activeTab === "Output" ? "active" : ""}`} onClick={() => setActiveTab("Output")}>Saída</div>
          </div>

          <div className="system-calls-code-box">
            {renderContent()}
          </div>

          <button className="system-calls-compile-btn" onClick={handleCompileAndRun}>▶ Compilar & Executar</button>
        </main>
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import NavBar from "../components/NavBar";
// import "./SystemCallsPage.css";

// const systemCalls = [
//   { name: "fork()", description: "Cria um novo processo duplicando o processo atual", type: "Processo" },
//   { name: "open()", description: "Abre um arquivo e retorna um descritor de arquivo", type: "Entrada/Saída" },
//   { name: "malloc()", description: "Aloca memória dinâmica na heap", type: "Memória" },
//   { name: "read()", description: "Lê dados de um descritor de arquivo", type: "Entrada/Saída" },
//   { name: "write()", description: "Escreve dados em um descritor de arquivo", type: "Entrada/Saída" },
//   { name: "exec()", description: "Substitui o processo atual por uma nova imagem de programa", type: "Processo" },
//   { name: "wait()", description: "Aguarda a finalização de um processo filho", type: "Processo" },
// ];

// const codeExample = `#include <stdio.h>
// #include <unistd.h>
// #include <sys/wait.h>

// int main() {
//     pid_t pid = fork();

//     if (pid == 0) {
//         printf("Processo filho: PID = %d\\n", getpid());
//     } else if (pid > 0) {
//         printf("Processo pai: PID = %d, PID do filho = %d\\n", getpid(), pid);
//         wait(NULL);
//     } else {
//         perror("fork falhou");
//     }
//     return 0;
// }`;

// const explanationText = `A chamada de sistema fork() cria um novo processo duplicando o processo atual.
// O valor de retorno difere entre pai e filho:
// - 0 no processo filho
// - PID positivo no processo pai
// - -1 em caso de erro`;

// const outputExample = `Processo pai: PID = 12345, PID do filho = 12346
// Processo filho: PID = 12346`;

// export default function SystemCallsExplorer() {
//   const [selected, setSelected] = useState("fork()");
//   const [activeTab, setActiveTab] = useState("Code");

//   const renderContent = () => {
//     if (activeTab === "Code") {
//       return <pre>{codeExample}</pre>;
//     } else if (activeTab === "Explanation") {
//       return <pre>{explanationText}</pre>;
//     } else if (activeTab === "Output") {
//       return <pre>{outputExample}</pre>;
//     }
//   };

//   return (
//     <div className="system-calls-container">
//       <NavBar />
//       <header className="system-calls-header">
//         <h1>Explorador de Chamadas de Sistema</h1>
//         <p>Explore chamadas de sistema essenciais com exemplos interativos de código</p>
//       </header>

//       <div className="system-calls-content">
//         <aside className="system-calls-sidebar">
//           <h2>Chamadas de Sistema</h2>
//           <p>Clique em uma chamada para explorar</p>

//           {systemCalls.map((call) => (
//             <div
//               key={call.name}
//               className={`system-calls-card ${selected === call.name ? "selected" : "unselected"}`}
//               onClick={() => setSelected(call.name)}
//             >
//               <div className="system-calls-card-header">
//                 <span className="system-calls-title">{call.name}</span>
//                 <span className="system-calls-type">{call.type}</span>
//               </div>
//               <div className="system-calls-description">{call.description}</div>
//             </div>
//           ))}
//         </aside>

//         <main className="system-calls-main-content">
//           <div className="system-calls-call-header">
//             <h3>{selected}</h3>
//             <span>{systemCalls.find((c) => c.name === selected).description}</span>
//           </div>

//           <div className="system-calls-tabs">
//             <div className={`system-calls-tab ${activeTab === "Code" ? "active" : ""}`} onClick={() => setActiveTab("Code")}>Código</div>
//             <div className={`system-calls-tab ${activeTab === "Explanation" ? "active" : ""}`} onClick={() => setActiveTab("Explanation")}>Explicação</div>
//             <div className={`system-calls-tab ${activeTab === "Output" ? "active" : ""}`} onClick={() => setActiveTab("Output")}>Saída</div>
//           </div>

//           <div className="system-calls-code-box">
//             {renderContent()}
//           </div>

//           <button className="system-calls-compile-btn">▶ Compilar & Executar</button>
//         </main>
//       </div>
//     </div>
//   );
// }
