import { useState, useEffect } from 'react'
import MarkdownEditor from './MarkdownEditor'
import './App.css'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  )

  function saveNote() {
    if (!title.trim() && !body.trim()) return

    if (editingId) {
      setNotes(notes.map((n) =>
        n.id === editingId
          ? { ...n, title, body, updatedAt: new Date().toISOString() }
          : n
      ))
      setEditingId(null)
    } else {
      const newNote = {
        id: generateId(),
        title,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes([newNote, ...notes])
    }

    setTitle('')
    setBody('')
  }

  function editNote(note) {
    setEditingId(note.id)
    setTitle(note.title)
    setBody(note.body)
  }

  function deleteNote(id) {
    setNotes(notes.filter((n) => n.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setTitle('')
      setBody('')
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setTitle('')
    setBody('')
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notes</h1>
        <input
          className="search"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="app-main">
        <section className="editor">
          <h2>{editingId ? 'Edit Note' : 'New Note'}</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-title"
          />
          <MarkdownEditor
            value={body}
            onChange={setBody}
            placeholder="Write your markdown here..."
          />
          <div className="editor-actions">
            <button className="btn-primary" onClick={saveNote}>
              {editingId ? 'Update' : 'Add Note'}
            </button>
            {editingId && (
              <button className="btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </section>

        <section className="notes-list">
          {filteredNotes.length === 0 ? (
            <p className="empty">
              {search ? 'No notes match your search.' : 'No notes yet. Add one above!'}
            </p>
          ) : (
            filteredNotes.map((note) => (
              <article key={note.id} className={`note-card ${editingId === note.id ? 'editing' : ''}`}>
                <div className="note-content">
                  {note.title && <h3 className="note-title">{note.title}</h3>}
                  {note.body && <p className="note-body">{note.body}</p>}
                  <span className="note-date">
                    {note.updatedAt !== note.createdAt ? 'Updated' : 'Created'}{' '}
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
                <div className="note-actions">
                  <button className="btn-edit" onClick={() => editNote(note)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteNote(note.id)}>Delete</button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
