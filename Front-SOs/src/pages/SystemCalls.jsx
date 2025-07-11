import React, { useState } from "react"; // Importa React e o hook useState
import NavBar from "../components/NavBar"; // Importa o componente de navegação
import "./SystemCallsPage.css"; // Importa o CSS da página

// Array com todas as chamadas de sistema e seus dados
const systemCalls = [
  // Cada objeto representa uma chamada de sistema com nome, tipo, código C e explicação
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
            fprintf(stderr, "Erro ao criar processo\\n");
            exit(1);
        }
    
        if (pid == 0) {
            printf("FILHO:\\t ID eh %d, valor de pid eh %d\\n", getpid(), pid);
        } else {
            printf("PAI:\\t ID eh %d, pid (filho) eh %d\\n", getpid(), pid);
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
          fprintf(stderr, "Erro ao criar processo\\n");
          exit(1);
      }
  
      if (pid == 0) {
          printf("FILHO:  id eh %d, pid (valor) eh %d\\n", getpid(), pid);
          execl("/bin/echo", "echo", "Executando novo processo com execl()", NULL);
          perror("exec falhou");
          exit(1);
      } else {
          printf("PAI:  id eh %d, pid (filho) eh %d\\n", getpid(), pid);
          printf("Processo pai aguardando filho\\n");
          wait(NULL);
          printf("Processo filho finalizado.\\n");
      }
  
      return 0;
  }`,
    explanation: `A chamada execl() substitui o processo atual por outro.
  - Usado junto com fork() para o processo filho executar outro programa.
  - Se exec falhar, retorna -1 e continua no processo filho.`
  },
  {
    name: "wait()",
    description: "Aguarda a finalização de um processo filho",
    type: "Processo",
    code: `#include <stdio.h>
  #include <stdlib.h>
  #include <unistd.h>
  #include <sys/wait.h>
  
  int main() {
      // Garante que tudo seja impresso imediatamente
      setvbuf(stdout, NULL, _IONBF, 0);
  
      printf("Início do programa\\n");
  
      pid_t pid = fork();
  
      if (pid == -1) {
          perror("Erro ao criar processo");
          return 1;
      }
  
      if (pid == 0) {
          // Processo filho
          printf("FILHO: Iniciando execução (PID: %d)\\n", getpid());
          sleep(2);
          printf("FILHO: Finalizando\\n");
          exit(0);
      } else {
          // Processo pai
          printf("PAI: Aguardando filho terminar (PID: %d)\\n", pid);
          wait(NULL);
          printf("PAI: Filho finalizado\\n");
          sleep(1); // garante tempo para exibir antes de encerrar
      }
  
      return 0;
  }`,
    explanation: `A chamada wait() suspende o processo pai até que o filho finalize.\n- fork() cria o processo filho\n- wait() bloqueia o pai até o filho terminar\n- setvbuf desativa o buffer para que printf seja impresso imediatamente\n- sleep(1) no fim evita corte da última linha em terminais web`
  },
  {
    "name": "open()",
    "description": "Abre um arquivo e retorna um descritor de arquivo",
    "type": "Entrada/Saída",
    "code": "#include <fcntl.h>\n#include <unistd.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    setvbuf(stdout, NULL, _IONBF, 0);\n\n    int fd = open(\"arquivo_open.txt\", O_CREAT | O_WRONLY, 0644);\n\n    if (fd == -1) {\n        perror(\"Erro ao abrir/criar o arquivo\");\n        return 1;\n    }\n\n    printf(\"Arquivo aberto/criado com sucesso! FD: %d\\n\", fd);\n\n    close(fd);\n\n    printf(\"\\nListando arquivos na pasta isolada do usuário:\\n\");\n    system(\"pwd\");\n    system(\"ls -l\");\n\n    return 0;\n}",
    "explanation": "A chamada open() abre ou cria um arquivo.\n- O_CREAT: cria o arquivo se ele não existir\n- O_WRONLY: abre somente para escrita\n- O arquivo é criado na pasta isolada do usuário (cwd do processo)\n- system(\"pwd\") mostra a pasta atual\n- system(\"ls -l\") lista os arquivos no diretório"
  },
  {
    "name": "write()",
    "description": "Escreve dados em um descritor de arquivo",
    "type": "Entrada/Saída",
    "code": "#include <fcntl.h>\n#include <unistd.h>\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    setvbuf(stdout, NULL, _IONBF, 0);\n\n    const char *mensagem = \"Escrevendo com write()!\\n\";\n    int fd = open(\"arquivo_open.txt\", O_WRONLY | O_CREAT | O_TRUNC, 0644);\n\n    if (fd == -1) {\n        perror(\"Erro ao abrir o arquivo para escrita\");\n        return 1;\n    }\n\n    ssize_t bytesEscritos = write(fd, mensagem, strlen(mensagem));\n    if (bytesEscritos == -1) {\n        perror(\"Erro ao escrever\");\n        close(fd);\n        return 1;\n    }\n\n    printf(\"Bytes escritos: %zd\\n\", bytesEscritos);\n    printf(\"Mensagem escrita com sucesso.\\n\");\n\n    close(fd);\n\n    printf(\"\\nListando arquivos na pasta isolada do usuário:\\n\");\n    system(\"pwd\");\n    system(\"ls -l\");\n\n    return 0;\n}",
    "explanation": "A chamada write() escreve dados em um descritor de arquivo.\n- O_WRONLY abre o arquivo para escrita\n- O_CREAT cria o arquivo se ele não existir\n- O_TRUNC apaga o conteúdo anterior se o arquivo já existir\n- Retorna o número de bytes escritos ou -1 em caso de erro\n- Usa setvbuf() para garantir visibilidade\n- system(\"pwd\") mostra o caminho da pasta do usuário"
  },
  {
    "name": "read()",
    "description": "Lê dados de um descritor de arquivo",
    "type": "Entrada/Saída",
    "code": "#include <fcntl.h>\n#include <unistd.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    setvbuf(stdout, NULL, _IONBF, 0);\n\n    int fd;\n    char buffer[128];\n    ssize_t bytesLidos;\n\n    fd = open(\"arquivo_open.txt\", O_RDONLY);\n    if (fd == -1) {\n        perror(\"Erro ao abrir o arquivo para leitura\");\n        return 1;\n    }\n\n    bytesLidos = read(fd, buffer, sizeof(buffer) - 1);\n    if (bytesLidos == -1) {\n        perror(\"Erro ao ler o arquivo\");\n        close(fd);\n        return 1;\n    }\n\n    buffer[bytesLidos] = '\\0';\n    printf(\"Bytes lidos: %zd\\nConteúdo lido: %s\\n\", bytesLidos, buffer);\n\n    close(fd);\n\n    printf(\"\\nConteúdo do diretório do usuário:\\n\");\n    system(\"pwd\");\n    system(\"ls -l\");\n\n    return 0;\n}",
    "explanation": "A chamada read() lê até N bytes de um descritor de arquivo e armazena no buffer.\n- O arquivo precisa estar aberto com O_RDONLY\n- Retorna o número de bytes lidos ou -1 em caso de erro\n- Usa setvbuf() para garantir visibilidade\n- system(\"pwd\") mostra o diretório atual, que é isolado por usuário"
  },
  {
    name: "sbrk()",
    description: "Aloca ou expande regiões de memória dinamicamente",
    type: "Memória",
    code: `#include <stdio.h>
  #include <unistd.h>
  
  int main() {
      // Garante exibição imediata no terminal
      setvbuf(stdout, NULL, _IONBF, 0);
  
      void *heap_atual = sbrk(0); // obtém o topo atual do heap
      printf("Endereço atual do heap: %p\\n", heap_atual);
  
      void *novo_heap = sbrk(4096); // tenta expandir o heap em 4 KB
  
      if (novo_heap == (void *)-1) {
          perror("Erro ao expandir o heap");
          return 1;
      }
  
      printf("Novo endereço do heap: %p\\n", sbrk(0));
      return 0;
  }`,
    explanation: `A chamada sbrk() ajusta o topo do heap de um processo.\n- sbrk(0): retorna o endereço atual do heap\n- sbrk(N): tenta aumentar o heap em N bytes\n- Retorna (void *)-1 em caso de erro\n- Útil para alocação manual de memória em baixo nível`
  },
  {
    name: "mmap()",
    description: "Mapeia e manipula uma região de memória virtual",
    type: "Memória",
    code: `#include <stdio.h>
  #include <stdlib.h>
  #include <sys/mman.h>
  #include <string.h>
  #include <unistd.h>
  
  int main() {
      setvbuf(stdout, NULL, _IONBF, 0);
  
      size_t tamanho = 4096; // 4 KB
  
      void *ptr = mmap(NULL, tamanho, PROT_READ | PROT_WRITE,
                       MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  
      if (ptr == MAP_FAILED) {
          perror("Erro ao mapear memória");
          return 1;
      }
  
      printf("Memória mapeada com sucesso em: %p\\n", ptr);
  
      strcpy((char *)ptr, "Hello, mmap!");
  
      printf("Conteúdo escrito na memória: %s\\n", (char *)ptr);
  
      if (munmap(ptr, tamanho) == -1) {
          perror("Erro ao liberar memória");
          return 1;
      }
  
      printf("Memória liberada com sucesso.\\n");
  
      return 0;
  }`,
    explanation: `A chamada mmap() cria uma região de memória mapeada.\n- MAP_ANONYMOUS: memória não associada a arquivo\n- PROT_READ | PROT_WRITE: permite leitura e escrita\n- Após o uso, é necessário liberar com munmap()\n- Ideal para manipular memória em baixo nível, como buffers temporários`
  },
  {
  name: "munmap()",
  description: "Desfaz o mapeamento de uma região de memória",
  type: "Memória",
  code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <unistd.h>

int main() {
    setvbuf(stdout, NULL, _IONBF, 0);

    size_t tamanho = 4096; // 4 KB

    void *ptr = mmap(NULL, tamanho, PROT_READ | PROT_WRITE,
                     MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);

    if (ptr == MAP_FAILED) {
        perror("Erro ao mapear memória");
        return 1;
    }

    printf("Memória mapeada no endereço: %p\\n", ptr);

    if (munmap(ptr, tamanho) == -1) {
        perror("Erro ao liberar memória");
        return 1;
    }

    printf("Memória liberada com sucesso.\\n");

    return 0;
}`,
  explanation: `A chamada munmap() desfaz o mapeamento de uma região de memória previamente alocada com mmap().\n- É necessário passar o ponteiro e o tamanho da região\n- Retorna 0 em sucesso ou -1 em erro\n- Após munmap(), o acesso à região pode causar falha (segfault)`
}

];

// Componente principal da página de exploração de system calls
export default function SystemCallsExplorer() {
  const [selected, setSelected] = useState("fork()"); // Armazena a system call selecionada
  const [activeTab, setActiveTab] = useState("Code"); // Aba ativa (Code, Explanation, Output)
  const [stdout, setStdout] = useState(""); // Saída padrão da execução do código
  const [stderr, setStderr] = useState(""); // Saída de erro da execução do código

  const token = localStorage.getItem("token"); // Recupera o token JWT do usuário (se existir)
  console.log("TOKEN", localStorage.getItem("token")); // Loga o token no console (debug)

  // Busca a system call atualmente selecionada
  const currentCall = systemCalls.find((c) => c.name === selected);

  // Renderiza o conteúdo da aba ativa
  const renderContent = () => {
    if (activeTab === "Code") return <pre>{currentCall.code}</pre>; // Aba de código
    if (activeTab === "Explanation") return <pre>{currentCall.explanation}</pre>; // Aba de explicação
    if (activeTab === "Output") // Aba de saída (execução)
      return (
        <div>
          <pre><strong>stdout:</strong> <br />{stdout}</pre>
          <pre><strong>stderr:</strong> {stderr}</pre>
        </div>
      );
  };

  // Envia código para o backend compilar e executar
  const handleCompileAndRun = async () => {
    try {
      const token = localStorage.getItem("token"); // Reobtém o token (por segurança)

      // Se não houver token, bloqueia execução
      if (!token) {
        setStdout("");
        setStderr("Usuário não autenticado. Faça login.");
        setActiveTab("Output");
        return;
      }

      // Envia a system call selecionada para execução no backend
      const response = await fetch("http://andromeda.lasdpc.icmc.usp.br:8182/api/systemcalls/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Token de autenticação JWT
        },
        body: JSON.stringify({ codigo: currentCall.code }), // Código a ser executado
      });

      const result = await response.json(); // Resposta da API

      // Se o backend retornou erro de autenticação
      if (response.status === 401) {
        setStdout("");
        setStderr("Usuário não autenticado. Faça login.");
      } else {
        // Exibe stdout e stderr retornados
        setStdout(result.stdout || "");
        setStderr(result.stderr || "");
      }

      setActiveTab("Output"); // Ativa aba de saída após execução
    } catch (err) {
      // Erro de rede ou do servidor
      setStdout("");
      setStderr("Erro ao conectar com o backend.");
      setActiveTab("Output");
    }
  };

  // JSX da interface
  return (
    <div className="system-calls-container">
      <NavBar /> {/* Componente de navegação */}
      <header className="system-calls-header">
        <h1>Explorador de Chamadas de Sistema</h1>
        <p>Explore chamadas de sistema essenciais com exemplos interativos de código</p>
      </header>

      <div className="system-calls-content">
        {/* Coluna lateral esquerda com lista de chamadas */}
        <aside className="system-calls-sidebar">
          <h2>Chamadas de Sistema</h2>
          <p>Clique em uma chamada para explorar</p>

          {/* Lista com todas as system calls */}
          {systemCalls.map((call) => (
            <div
              key={call.name}
              className={`system-calls-card ${selected === call.name ? "selected" : "unselected"}`}
              onClick={() => setSelected(call.name)} // Muda chamada selecionada
            >
              <div className="system-calls-card-header">
                <span className="system-calls-title">{call.name}</span>
                <span className="system-calls-type">{call.type}</span>
              </div>
              <div className="system-calls-description">{call.description}</div>
            </div>
          ))}
        </aside>

        {/* Coluna principal com conteúdo da chamada selecionada */}
        <main className="system-calls-main-content">
          <div className="system-calls-call-header">
            <h3>{selected}</h3>
            <span>{currentCall.description}</span>
          </div>

          {/* Abas: Código / Explicação / Saída */}
          <div className="system-calls-tabs">
            <div className={`system-calls-tab ${activeTab === "Code" ? "active" : ""}`} onClick={() => setActiveTab("Code")}>Código</div>
            <div className={`system-calls-tab ${activeTab === "Explanation" ? "active" : ""}`} onClick={() => setActiveTab("Explanation")}>Explicação</div>
            <div className={`system-calls-tab ${activeTab === "Output" ? "active" : ""}`} onClick={() => setActiveTab("Output")}>Saída</div>
          </div>

          {/* Conteúdo da aba selecionada */}
          <div className="system-calls-code-box">
            {renderContent()}
          </div>

          {/* Botão para compilar e executar */}
          <button className="system-calls-compile-btn" onClick={handleCompileAndRun}>▶ Compilar & Executar</button>
        </main>
      </div>
    </div>
  );
}