
import React, { useEffect, useState } from 'react';
import './Notes.css';
import NavBar from '../components/NavBar.jsx';

function Notes() {
  // Estado para armazenar todas as anotações criadas
  const [notes, setNotes] = useState([]);
  // Estado para armazenar o texto atual digitado no textarea
  const [newNote, setNewNote] = useState('');

  const token = localStorage.getItem('token');

  // Buscar notas do usuário logado
  useEffect(() => {
    fetch('/api/notes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error('Erro ao buscar notas:', err));
  }, []);

  // Adicionar nota
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newNote })
      });

      const createdNote = await res.json();
      setNotes([createdNote, ...notes]);
      setNewNote('');
    } catch (err) {
      console.error('Erro ao adicionar nota:', err);
    }
  };

  // Deletar nota
  const handleDeleteNote = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.error('Erro ao deletar nota:', err);
    }
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
              
              {notes.map((note) => (
                <li key={note._id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <span style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note.text}</span>
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
                    onClick={() => handleDeleteNote(note._id)}
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
export default Notes;

