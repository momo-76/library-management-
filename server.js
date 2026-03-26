const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const path = require('path')

const app = express()
const db = new sqlite3.Database('library.db')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL, isbn TEXT, available INTEGER DEFAULT 1)')
  db.run('CREATE TABLE IF NOT EXISTS members (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT)')
  db.run('CREATE TABLE IF NOT EXISTS issued (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER, member_id INTEGER, issue_date TEXT)')
})

app.get('/books', function(req, res) {
  db.all('SELECT * FROM books', function(err, rows) {
    res.json(rows)
  })
})

app.post('/books', function(req, res) {
  var title = req.body.title
  var author = req.body.author
  var isbn = req.body.isbn
  db.run('INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)', [title, author, isbn], function(err) {
    res.json({ id: this.lastID, message: 'Book added!' })
  })
})

app.delete('/books/:id', function(req, res) {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], function(err) {
    res.json({ message: 'Book deleted!' })
  })
})

app.get('/members', function(req, res) {
  db.all('SELECT * FROM members', function(err, rows) {
    res.json(rows)
  })
})

app.post('/members', function(req, res) {
  var name = req.body.name
  var email = req.body.email
  db.run('INSERT INTO members (name, email) VALUES (?, ?)', [name, email], function(err) {
    res.json({ id: this.lastID, message: 'Member added!' })
  })
})

app.post('/issue', function(req, res) {
  var book_id = req.body.book_id
  var member_id = req.body.member_id
  var date = new Date().toISOString().split('T')[0]
  db.run('INSERT INTO issued (book_id, member_id, issue_date) VALUES (?, ?, ?)', [book_id, member_id, date], function(err) {
    db.run('UPDATE books SET available = 0 WHERE id = ?', [book_id], function(err) {
      res.json({ message: 'Book issued!' })
    })
  })
})

app.post('/return', function(req, res) {
  var book_id = req.body.book_id
  db.run('DELETE FROM issued WHERE book_id = ?', [book_id], function(err) {
    db.run('UPDATE books SET available = 1 WHERE id = ?', [book_id], function(err) {
      res.json({ message: 'Book returned!' })
    })
  })
})

app.listen(3000, function() {
  console.log('Server running at http://localhost:3000')
})