# 🍬 Sweet Harmony System

Sweet Harmony System is a full-stack **Sweet Shop Management Application** designed to manage sweets, users, and roles efficiently. The system supports **role-based access**, where only admins can manage sweets, while users can view available items. It is built using modern web technologies with a clean and scalable architecture.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - User and Admin roles
  - Role-based access control (Admin-only actions)

- 🍭 **Sweet Management**
  - Add, update, delete sweets (Admin only)
  - View sweets list (All users)

- 🧑‍💼 **User Management**
  - User registration and login
  - Secure password handling

- 🖥️ **Modern UI**
  - Responsive frontend
  - Clean and simple design

- 🗄️ **Database Integration**
  - Structured schema for users and sweets
  - Secure data handling

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- CSS / Tailwind (if applicable)

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- PostgreSQL / MySQL (as per setup)

### Tools
- Git & GitHub
- npm

---

## 📂 Project Structure

Sweet-harmony-system
│── backend
│ ├── routes
│ ├── controllers
│ ├── models
│ └── server.js
│
│── frontend
│ ├── src
│ ├── components
│ └── main.jsx
│
│── README.md
│── package.json

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/hemant101104/Sweet-harmony-system.git
cd Sweet-harmony-system
2️⃣ Backend setup
bash
Copy code
cd backend
npm install
npm start
3️⃣ Frontend setup
bash
Copy code
cd frontend
npm install
npm run dev
🔑 Environment Variables
Create a .env file in the backend folder and add:

env
Copy code
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sweet_harmony
JWT_SECRET=your_secret_key
🧪 API Highlights
POST /login – User login

POST /register – User registration

GET /sweets – View sweets

POST /sweets – Add sweet (Admin only)

📌 Future Enhancements
Payment integration

Order management

Inventory tracking

Admin dashboard analytics

👤 Author
Hemant Singh
GitHub: hemant101104

📄 License
This project is for educational purposes.

markdown
Copy code

If you want, I can also:
- Simplify this for **college assignment**
- Customize it for **resume / recruiter view**
- Add **screenshots section** or **API docs**
