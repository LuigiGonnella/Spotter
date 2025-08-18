# Spotter 🏋️‍♂️🤝

**Spotter** is a social network dedicated to the world of gyms and fitness.  
Not just workouts: it’s a way to turn the gym from a simple place of exercise into a real community.

## 🚀 Vision
Connecting people who already share the same space (gym, weight room, fitness area) and giving them tools to meet, motivate each other, and grow together.

## ✨ Key Features
- **GymBro Feature** → send a request to a buddy to train together.  
- **Local Community** → join your gym or nearby fitness centers.  
- **Chat & Social** → direct chat with members to organize workouts.  
- **Leaderboard & Ranking** → internal gym leaderboards for each exercise (e.g., bench press record 190 kg by Mario Rossi 🏆).  
- **Discovery** → find new buddies in nearby gyms and expand your fitness network.  

## 🎯 Why Spotter?
Today, many people at the gym just exchange a nod. Spotter wants to close this gap, making socialization easier and turning the gym into an active, motivating, and fun community.

---
# Struttura progetto

```text
gymbuddy/
├─ backend/                  # Server Express/Node
│  ├─ src/
│  │  ├─ config/             # Configurazioni: DB, OAuth, JWT, ecc.
│  │  │  ├─ db.mjs           # ESM
│  │  │  └─ oauth.mjs        # ESM
│  │  ├─ controllers/        # Logica delle API
│  │  │  ├─ authController.mjs
│  │  │  ├─ userController.mjs
│  │  │  ├─ workoutController.mjs
│  │  │  ├─ chatController.mjs
│  │  │  └─ leaderboardController.mjs
│  │  ├─ routes/             # Route definitions
│  │  │  ├─ authRoutes.mjs
│  │  │  ├─ userRoutes.mjs
│  │  │  ├─ workoutRoutes.mjs
│  │  │  ├─ chatRoutes.mjs
│  │  │  └─ leaderboardRoutes.mjs
│  │  ├─ models/             # ORM / Schema DB
│  │  │  ├─ User.mjs
│  │  │  ├─ Workout.mjs
│  │  │  ├─ Gym.mjs
│  │  │  ├─ ChatMessage.mjs
│  │  │  └─ Leaderboard.mjs
│  │  ├─ middlewares/        # Middleware: auth, error handling, logging
│  │  │  ├─ authMiddleware.mjs
│  │  │  └─ errorHandler.mjs
│  │  ├─ services/           # Servizi esterni o logiche complesse
│  │  │  ├─ googleOAuthService.mjs
│  │  │  ├─ notificationService.mjs
│  │  │  └─ rankingService.mjs
│  │  └─ app.mjs             # Entry point Express
│  └─ package.json
│
├─ frontend/                 # Next.js app
│  ├─ public/                # Static assets (logo, immagini, icone)
│  ├─ src/
│  │  ├─ components/         # Componenti UI riutilizzabili
│  │  │  ├─ Button/
│  │  │  ├─ Navbar/
│  │  │  ├─ Card/
│  │  │  └─ ChatBubble/
│  │  ├─ features/           # Funzionalità specifiche
│  │  │  ├─ auth/
│  │  │  │  ├─ GoogleLoginButton.js
│  │  │  │  └─ LoginForm.js
│  │  │  ├─ gymBro/
│  │  │  │  ├─ RequestBuddy.js
│  │  │  │  └─ BuddyList.js
│  │  │  ├─ chat/
│  │  │  │  ├─ ChatWindow.js
│  │  │  │  └─ MessageInput.js
│  │  │  ├─ leaderboard/
│  │  │  │  └─ LeaderboardTable.js
│  │  │  └─ discovery/
│  │  │     └─ NearbyGyms.js
│  │  ├─ hooks/              # Custom React hooks (es: useAuth, useFetch)
│  │  ├─ contexts/           # Context API / Zustand / Redux slices
│  │  ├─ pages/              # Pagine Next.js
│  │  │  ├─ index.js
│  │  │  ├─ login.js
│  │  │  ├─ profile/[id].js
│  │  │  ├─ chat/[roomId].js
│  │  │  └─ leaderboard.js
│  │  ├─ services/           # Funzioni di fetch API / wrapper axios
│  │  ├─ styles/             # CSS / Tailwind / SCSS
│  │  └─ utils/              # Helper functions
│  └─ package.json
│
├─ database/                 # Script per DB / migrazioni / seed
│  ├─ migrations/
│  └─ seeds/
│
├─ docker/                   # Configurazioni Docker
│  ├─ Dockerfile.frontend
│  ├─ Dockerfile.backend
│  └─ docker-compose.yml
│
├─ .env.local                # Variabili ambiente frontend
├─ .env                      # Variabili ambiente backend
└─ README.md

