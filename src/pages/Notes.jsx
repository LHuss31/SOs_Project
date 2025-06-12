import React, { useState } from 'react';
import './Notes.css';
import NavBar from '../components/NavBar';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, { text: newNote }]);
    setNewNote('');
  };

  const handleDeleteNote = (idxToDelete) => {
    setNotes(notes.filter((_, idx) => idx !== idxToDelete));
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
                <li key={idx} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <span style={{ flex: 1 }}>{note.text}</span>
                  <button
                    style={{
                      marginLeft: 10,
                      background: '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '2px 8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteNote(idx)}
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