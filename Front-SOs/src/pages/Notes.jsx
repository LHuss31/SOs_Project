import React, { useState } from 'react';
import './Notes.css';
import NavBar from '../components/NavBar.jsx';

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
      <div className="containerN">
        <div className="Login-containerN">
          <h2>Anotações</h2>
          <form onSubmit={handleAddNote} style={{ width: '100%' }}>
            <textarea
              placeholder="Digite sua anotação..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              style={{ marginBottom: 10, resize: 'vertical', minHeight: 40, maxHeight: 200, width: '100%' }}
            />
            <button type="submit">Adicionar</button>
          </form>
          <div style={{ marginTop: 30, width: '100%' }}>
            <h3>Anotações existentes:</h3>
            <ul>
              {notes.map((note, idx) => (
                <li key={idx} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <span style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note.text}</span>
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