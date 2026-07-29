# Finnova

AI-powered personal finance management platform — a full-stack project built by a 2-person team.

## Repo layout
```
Finnova/
├── backend/    Spring Boot API (Member A)
└── frontend/   React + Vite UI (Member B)
```

## Week 1 scope
- Create the GitHub repository structure and project foundation
- Backend: Spring Boot project (Web, Data JPA, MySQL Driver, Lombok, Validation), package structure, Users/Roles tables, MySQL connection
- Frontend: React + Vite with Tailwind CSS, landing page, navbar, footer, 404 page
- Organize folders on both sides (controller/service/repository/entity/dto/config/security/exception/utils for backend; components/pages/hooks/redux/services/utils/assets for frontend)

## Week 2 scope
- Backend: user registration & login, JWT access + refresh tokens, BCrypt password hashing, Spring Security, role-based auth
- APIs: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`
- `ROLE_USER` / `ROLE_ADMIN` seeded automatically on startup; new registrations get `ROLE_USER`
- All non-`/api/auth/**` endpoints require a valid `Authorization: Bearer <token>` header

## Backend setup (Member A)
Requirements: JDK 21 (an LTS build — **not JDK 26**, whose class files Lombok's annotation processor doesn't support yet), Maven, MySQL (or MariaDB, e.g. via XAMPP) running locally on port 3306.

1. Start your MySQL/MariaDB server (e.g. the XAMPP Control Panel's MySQL module)
2. Create the database: `CREATE DATABASE finnova_db;`
3. Defaults in `backend/src/main/resources/application.properties` assume `root` with no password (XAMPP's default) — set `DB_USERNAME` / `DB_PASSWORD` env vars if yours differs
4. From `backend/`, run `mvn spring-boot:run`
5. API starts on `http://localhost:8080`; Hibernate auto-creates the `users`, `roles`, and `user_roles` tables on first run

## Frontend setup (Member B)
1. Install Node.js and npm
2. From `frontend/`, run `npm install`
3. Run `npm run dev`

## Member focus
- **Member A** — Backend & DevOps (Spring Boot, Spring Security, JPA/Hibernate, MySQL, Redis, AI APIs, Docker, deployment)
- **Member B** — Frontend & UI (React, Tailwind CSS, Redux Toolkit, React Router, Axios, charts, responsive UI)
