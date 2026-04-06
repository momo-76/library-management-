# 📚 Library Management System

A basic full-stack web application developed to manage books in a library.
The system allows users to add and view books through a simple interface using a backend server.

---

## 🚀 Live Demo

* Frontend: https://library-management-06kf.onrender.com

-----

## ⚙️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Deployment:** Render
* **Version Control:** GitHub

---

## 🧠 Features

* Add books with ISBN, title, and author
* View list of books
* Backend API handling using Express
* Basic client-server communication

---

## 🏗️ Project Structure

```
library-management/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│
└── README.md
```

---

## 🔌 Working of the System

1. User enters book details in the frontend
2. Frontend sends request to backend server
3. Backend processes request and stores data temporarily
4. Backend sends data back to frontend
5. Frontend displays the data

---

## 🌐 API Endpoints

* `GET /books` → Fetch all books
* `POST /books` → Add new book

---

## ⚠️ Limitations

* Data is not stored permanently
* Data may reset when server restarts
* No database integration

---

## 🔮 Future Improvements

* Integrate database (PostgreSQL / MongoDB)
* Add user authentication
* Implement book issue and return system
* Improve UI

---

## 👤 Author

**Prince T M**

---

## 📌 Conclusion

This project demonstrates the basic concept of client-server interaction using Node.js and Express. It helped in understanding how frontend and backend communicate in a web application.
