import React, { useState } from "react";
import NavBar from "../components/NavBar";
import "./SystemCallsPage.css";

const systemCalls = [
    { name: "fork()", description: "Creates a new process by duplicating the calling process", type: "Process" },
    { name: "open()", description: "Opens a file and returns a file descriptor", type: "File I/O" },
    { name: "malloc()", description: "Allocates dynamic memory from the heap", type: "Memory" },
    { name: "read()", description: "Reads data from a file descriptor", type: "I/O" },
    { name: "write()", description: "Writes data to a file descriptor", type: "I/O" },
    { name: "exec()", description: "Replaces current process image with a new program", type: "Process" },
    { name: "wait()", description: "Waits for a child process to terminate", type: "Process" },
];

const codeExample = `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        printf("Child process: PID = %d\\n", getpid());
    } else if (pid > 0) {
        printf("Parent process: PID = %d, Child PID = %d\\n", getpid(), pid);
        wait(NULL);
    } else {
        perror("fork failed");
    }
    return 0;
}`;

const explanationText = `The fork() system call creates a new process by duplicating the current process.
The return value differs between parent and child:
- 0 for child
- positive PID for parent
- -1 for error.`;

const outputExample = `Parent process: PID = 12345, Child PID = 12346
Child process: PID = 12346`;

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
    <h1>System Calls Explorer</h1>
    <p>Explore essential system calls with interactive code examples</p>
  </header>

  <div className="system-calls-content">
    <aside className="system-calls-sidebar">
      <h2>System Calls</h2>
      <p>Click on a system call to explore</p>

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
        <div className={`system-calls-tab ${activeTab === "Code" ? "active" : ""}`} onClick={() => setActiveTab("Code")}>Code</div>
        <div className={`system-calls-tab ${activeTab === "Explanation" ? "active" : ""}`} onClick={() => setActiveTab("Explanation")}>Explanation</div>
        <div className={`system-calls-tab ${activeTab === "Output" ? "active" : ""}`} onClick={() => setActiveTab("Output")}>Output</div>
      </div>

      <div className="system-calls-code-box">
        {renderContent()}
      </div>

      <button className="system-calls-compile-btn">▶ Compile & Run</button>
    </main>
  </div>
</div>
    );
}
