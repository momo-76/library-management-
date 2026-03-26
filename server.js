const express = require('express')
const Database = require('better-sqlite3')
const cors = require('cors')
const path = require('path')

const app = express()
const db = new Database('library.db')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    available INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT
  );
  CREATE TABLE IF NOT EXISTS issued (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    member_id INTEGER,
    issue_date TEXT,
    FOREIGN KEY(book_id) REFERENCES books(id),
    FOREIGN KEY(member_id) REFERENCES members(id)
  );
`)

app.get('/books', (req, res) => {
  const books = db.prepare('SELECT * FROM books').all()
  res.json(books)
})

app.post('/books', (req, res) => {
  const { title, author, isbn } = req.body
  const result = db.prepare(
    'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)'
  ).run(title, author, isbn)
  res.json({ id: result.lastInsertRowid, message: 'Book added!' })
})

app.delete('/books/:id', (req, res) => {
  db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id)
  res.json({ message: 'Book deleted!' })
})

app.get('/members', (req, res) => {
  const members = db.prepare('SELECT * FROM members').all()
  res.json(members)
})

app.post('/members', (req, res) => {
  const { name, email } = req.body
  const result = db.prepare(
    'INSERT INTO members (name, email) VALUES (?, ?)'
  ).run(name, email)
  res.json({ id: result.lastInsertRowid, message: 'Member added!' })
})

app.post('/issue', (req, res) => {
  const { book_id, member_id } = req.body
  const date = new Date().toISOString().split('T')[0]
  db.prepare(
    'INSERT INTO issued (book_id, member_id, issue_date) VALUES (?, ?, ?)'
  ).run(book_id, member_id, date)
  db.prepare('UPDATE books SET available = 0 WHERE id = ?').run(book_id)
  res.json({ message: 'Book issued!' })
})

app.post('/return', (req, res) => {
  const { book_id } = req.body
  db.prepare('DELETE FROM issued WHERE book_id = ?').run(book_id)
  db.prepare('UPDATE books SET available = 1 WHERE id = ?').run(book_id)
  res.json({ message: 'Book returned!' })
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
