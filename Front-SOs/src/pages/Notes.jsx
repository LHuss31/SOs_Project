import React, { useState } from 'react'; // Importa o React e o hook useState para gerenciamento de estado
import './Notes.css'; // Importa o arquivo CSS para estilização da página de notas
import NavBar from '../components/NavBar.jsx'; // Importa o componente de navegação

function Notes() {
  // Estado para armazenar todas as anotações criadas
  const [notes, setNotes] = useState([]);
  // Estado para armazenar o texto atual digitado no textarea
  const [newNote, setNewNote] = useState('');

  // Função chamada ao submeter o formulário para adicionar uma nova anotação
  const handleAddNote = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    if (!newNote.trim()) return; // Impede adicionar notas vazias ou com apenas espaços
    setNotes([...notes, { text: newNote }]); // Adiciona a nova anotação ao array
    setNewNote(''); // Limpa o campo do textarea
  };

  // Função para apagar uma anotação específica com base no índice
  const handleDeleteNote = (idxToDelete) => {
    setNotes(notes.filter((_, idx) => idx !== idxToDelete)); // Remove a anotação da lista
  };

  return (
    <>
      <NavBar /> {/* Componente de navegação no topo */}
      <div className="containerN"> {/* Container geral da página */}
        <div className="Login-containerN"> {/* Container estilizado centralizado */}
          <h2>Anotações</h2> {/* Título da seção */}

          {/* Formulário para adicionar nova anotação */}
          <form onSubmit={handleAddNote} style={{ width: '100%' }}>
            <textarea
              placeholder="Digite sua anotação..." // Placeholder visível quando vazio
              value={newNote} // Valor atual do textarea
              onChange={e => setNewNote(e.target.value)} // Atualiza o estado conforme o usuário digita
              style={{
                marginBottom: 10,
                resize: 'vertical',
                minHeight: 40,
                maxHeight: 200,
                width: '100%',
              }}
            />
            <button type="submit">Adicionar</button> {/* Botão para adicionar anotação */}
          </form>

          {/* Lista de anotações já existentes */}
          <div style={{ marginTop: 30, width: '100%' }}>
            <h3>Anotações existentes:</h3>
            <ul>
              {notes.map((note, idx) => (
                <li
                  key={idx}
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {/* Texto da anotação com quebra de linha preservada */}
                  <span
                    style={{
                      flex: 1,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {note.text}
                  </span>
                  
                  {/* Botão para apagar a anotação */}
                  <button
                    style={{
                      marginLeft: 10,
                      background: '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '2px 8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteNote(idx)} // Chama a função para deletar a anotação
                  >
                    Apagar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notes; // Exporta o componente Notes para ser utilizado em outras partes da aplicação
