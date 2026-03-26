function showSection(name) {
  document.querySelectorAll('section').forEach(function(s) { s.classList.add('hidden') })
  document.getElementById(name).classList.remove('hidden')
  if (name === 'books') loadBooks()
  if (name === 'members') loadMembers()
}

function loadBooks() {
  fetch('http://localhost:3000/books')
    .then(function(res) { return res.json() })
    .then(function(books) {
      var tbody = document.getElementById('books-table')
      tbody.innerHTML = ''
      books.forEach(function(book) {
        var row = '<tr><td>' + book.id + '</td>'
        row += '<td>' + book.title + '</td>'
        row += '<td>' + book.author + '</td>'
        row += '<td>' + book.isbn + '</td>'
        row += '<td>' + (book.available ? 'Available' : 'Issued') + '</td>'
        row += '<td><button onclick=deleteBook(' + book.id + ')>Delete</button></td></tr>'
        tbody.innerHTML += row
      })
    })
}

function addBook() {
  var title = document.getElementById('title').value
  var author = document.getElementById('author').value
  var isbn = document.getElementById('isbn').value
  fetch('http://localhost:3000/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title, author: author, isbn: isbn })
  }).then(function() {
    loadBooks()
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('isbn').value = ''
  })
}

function deleteBook(id) {
  fetch('http://localhost:3000/books/' + id, { method: 'DELETE' })
    .then(function() { loadBooks() })
}

function loadMembers() {
  fetch('http://localhost:3000/members')
    .then(function(res) { return res.json() })
    .then(function(members) {
      var tbody = document.getElementById('members-table')
      tbody.innerHTML = ''
      members.forEach(function(m) {
        var row = '<tr><td>' + m.id + '</td>'
        row += '<td>' + m.name + '</td>'
        row += '<td>' + m.email + '</td></tr>'
        tbody.innerHTML += row
      })
    })
}

function addMember() {
  var name = document.getElementById('member-name').value
  var email = document.getElementById('member-email').value
  fetch('http://localhost:3000/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, email: email })
  }).then(function() {
    loadMembers()
    document.getElementById('member-name').value = ''
    document.getElementById('member-email').value = ''
  })
}

function issueBook() {
  var book_id = document.getElementById('issue-book-id').value
  var member_id = document.getElementById('issue-member-id').value
  fetch('http://localhost:3000/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: book_id, member_id: member_id })
  }).then(function(res) { return res.json() })
    .then(function(data) { alert(data.message) })
}

function returnBook() {
  var book_id = document.getElementById('return-book-id').value
  fetch('http://localhost:3000/return', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: book_id })
  }).then(function(res) { return res.json() })
    .then(function(data) { alert(data.message) })
}

loadBooks()