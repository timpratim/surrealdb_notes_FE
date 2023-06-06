import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);  // New piece of state

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await axios.get('http://localhost:3001/notes');
      setNotes(data);
    };

    fetchNotes();
  }, []);

  const addNote = async () => {
    const note = { title, content };
    const { data } = await axios.post('http://localhost:3001/notes', note);
    setNotes(oldNotes => [...oldNotes, data]);
    setTitle('');
    setContent('');
    setIsAddingNote(false);  // Hide inputs after adding note
  };

  const handleDelete = async (id) => {
    const { data } = await axios.delete(`http://localhost:3001/notes/${id}`);
    if (data.message === "Note deleted successfully") {
      setNotes(notes.filter(note => note._id !== id));
    } else {
      console.error("Failed to delete note.");
    }
  };

  return (
    <div className="container">
        <h1>Notes</h1>
        <button className="addButton" onClick={() => setIsAddingNote(true)}>+</button>
        {isAddingNote && (
            <>
                <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Title" 
                />
                <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder="Note"
                />
                <button onClick={addNote}>Submit Note</button>
            </>
        )}
        <div className="notesGrid"> {/* Wrap your notes with this div */}
            {notes.map(note => (
                <div key={note._id} className="note">
                    <h2 className="title" style={{ color: '#ff00a0' }}>{note.title}</h2>
                    <p>{note.content}</p>
                    <button onClick={() => handleDelete(note._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
}

export default App;
