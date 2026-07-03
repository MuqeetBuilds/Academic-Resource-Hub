# Academic Resource Hub

A web app I built for my college where seniors can upload study materials (notes, PDFs, assignments) and juniors can access them — but only after a teacher verifies the content. Think of it as a mini internal resource library for students.

## What it does

- **Juniors** log in and browse verified study notes, search by subject or title, and download PDFs
- **Seniors** can upload their notes (PDFs, DOC files) which go into a pending queue
- **Teachers** review pending submissions and approve or reject them with optional feedback
- Role-based access — each user type only sees what they're supposed to

## Tech stack

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT tokens, bcrypt for password hashing
- **File uploads:** Multer (PDF/DOC only, 10MB limit)

## Project structure

```
Academic Resource Hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Navbar, StatusBadge, EmptyState, etc.
│   │   ├── pages/          # Login, Register, Dashboard, Upload, TeacherDashboard
│   │   ├── api.js          # Centralized axios config
│   │   ├── App.js          # Routes
│   │   └── App.css         # All styles
│   └── public/
├── controllers/            # Auth and resource logic
├── middleware/              # JWT auth + role authorization
├── models/                 # User and Resource schemas
├── routes/                 # API route definitions
├── config/                 # Database connection
├── uploads/                # Uploaded files (gitignored)
├── server.js               # Express entry point
└── seed.js                 # Creates test users
```

## How to run locally

You'll need Node.js and MongoDB installed.

**1. Clone the repo**
```bash
git clone https://github.com/MuqeetBuilds/Academic-Resource-Hub.git
cd Academic-Resource-Hub
```

**2. Set up environment variables**

Create a `.env` file in the root:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/academic_hub
JWT_SECRET=pick-any-random-string-here
```

**3. Install dependencies**
```bash
npm install
cd client && npm install
```

**4. Seed test users (optional)**
```bash
node seed.js
```
This creates three test accounts (password for all: `password123`):
- `test@gmail.com` — Senior
- `junior@test.com` — Junior
- `teacher@test.com` — Teacher

**5. Start both servers**
```bash
# Terminal 1 — backend
npm run dev

# Terminal 2 — frontend
cd client
npm start
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:3000`.

## API routes

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Log in, get JWT token |
| GET | `/api/resources` | Authenticated | Get resources (filtered by role) |
| POST | `/api/resources/upload` | Senior only | Upload a new resource |
| PUT | `/api/resources/:id/verify` | Teacher only | Approve or reject a resource |

## Things I'd like to add later

- Cloud file storage so uploads persist after deploy
- Password reset flow
- Pagination for the dashboard when there are lots of notes
- Download count tracking
- Dark/light theme toggle

## License

MIT — do whatever you want with it.
