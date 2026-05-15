# 📝 Task Manager App

A full-stack Task Manager application with JWT-based authentication, built with React on the frontend and Node.js + Express on the backend, using MongoDB as the database.

---

## 📁 Project Structure

```
task-manager/
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTask.jsx
│   │   │   ├── EditTask.jsx
│   │   │   ├── List.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── utils/
│   │   │   └── fetchWithAuth.js
│   │   ├── style/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                    # never commit
│   ├── .env.example            # safe to commit
│   ├── .gitignore
│   └── package.json
│
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   └── app.js
│   ├── .env                    # never commit
│   ├── .env.example            # safe to commit
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 🧰 Tech Stack

### Frontend

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| React 18          | UI library                    |
| Vite              | Build tool and dev server     |
| React Router v6   | Client-side routing           |
| Bootstrap 5       | Styling and responsive layout |
| react-hot-toast   | Toast notifications           |
| JavaScript (ES6+) | Language                      |

### Backend

| Technology                    | Purpose                         |
| ----------------------------- | ------------------------------- |
| Node.js                       | Runtime environment             |
| Express.js                    | Web framework                   |
| MongoDB Atlas                 | Cloud database                  |
| MongoDB Node Driver           | Database client                 |
| JSON Web Token (jsonwebtoken) | Authentication                  |
| bcryptjs                      | Password hashing                |
| dotenv                        | Environment variable management |
| cors                          | Cross-origin resource sharing   |

---

## ✨ Features

- ✅ User authentication — Sign Up and Login with JWT
- ✅ Protected routes — unauthenticated users redirected to login
- ✅ Public routes — logged-in users redirected away from login/signup
- ✅ Add, edit, and delete tasks
- ✅ Bulk delete with checkboxes
- ✅ Confirmation modal before any delete
- ✅ Toast notifications for all actions
- ✅ Tasks are scoped per user — users only see their own tasks
- ✅ Token verified on every protected API call
- ✅ 404 page for unknown routes
- ✅ Responsive UI with Bootstrap

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
PORT=3200
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_secret_key
```

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3200
```

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/aadil124/task_management_system_mern_stack.git
cd task-manager
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## 📡 API Endpoints

### Auth Routes — `/auth`

| Method | Endpoint       | Description           | Auth Required |
| ------ | -------------- | --------------------- | ------------- |
| POST   | `/auth/signup` | Register a new user   | No            |
| POST   | `/auth/login`  | Login and receive JWT | No            |

### Task Routes — `/api`

| Method | Endpoint               | Description                      | Auth Required |
| ------ | ---------------------- | -------------------------------- | ------------- |
| GET    | `/api/task-list`       | Get all tasks for logged-in user | ✅ Yes        |
| GET    | `/api/task/:id`        | Get a single task by ID          | ✅ Yes        |
| POST   | `/api/add-task`        | Create a new task                | ✅ Yes        |
| PUT    | `/api/update/:id`      | Update a task by ID              | ✅ Yes        |
| DELETE | `/api/delete/:id`      | Delete a task by ID              | ✅ Yes        |
| DELETE | `/api/delete-multiple` | Delete multiple tasks by IDs     | ✅ Yes        |

### Authorization Header format

```
Authorization: Bearer <your_jwt_token>
```

---

## ☁️ Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set root directory to `backend`
4. Set build command: `npm install`
5. Set start command: `node index.js`
6. Add environment variables in Render dashboard:
   - `PORT`
   - `MONGO_URI`
   - `JWT_SECRET`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo, set root directory to `frontend`
3. Add environment variable in Vercel dashboard:
   - `VITE_API_BASE_URL` = your Render backend URL (e.g. `https://task-manager-api.onrender.com`)
4. Deploy

> After deploying, update your backend CORS `origin` to your Vercel frontend URL.

---

## 🛡️ Security Practices

- Passwords hashed with `bcryptjs` (salt rounds: 10)
- JWT tokens expire in 1 day
- All task routes protected by `verifyToken` middleware
- Tasks are user-scoped — users can only access their own data
- Sensitive config stored in `.env` files, never in source code
- `.env` files listed in `.gitignore`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
