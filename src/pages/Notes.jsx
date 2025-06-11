import React, { useState, useEffect } from 'react';
import './Notes.css';
import NavBar from '../components/NavBar';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Buscar notas do servidor ao carregar a página
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(() => setNotes([]));
  }, []);

  // Adicionar nova nota
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newNote }),
    });
    if (res.ok) {
      const note = await res.json();
      setNotes([...notes, note]);
      setNewNote('');
    } else {
      alert('Erro ao adicionar nota');
    }
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="Login-container">
          <form onSubmit={handleAddNote} style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Digite sua anotação..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <button type="submit">Adicionar</button>
          </form>
          <div style={{ marginTop: 30, width: '100%' }}>
            <h2>Notas de todos os usuários:</h2>
            <ul>
              {notes.map((note, idx) => (
                <li key={note.id || idx} style={{ marginBottom: 8 }}>
                  {note.text}
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