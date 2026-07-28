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

## Backend setup (Member A)
Requirements: JDK 21, Maven, MySQL running locally.

1. Create the database: `CREATE DATABASE finnova_db;`
2. Set `DB_USERNAME` / `DB_PASSWORD` env vars if not using the `root`/`root` defaults in `backend/src/main/resources/application.properties`
3. From `backend/`, run `mvn spring-boot:run`
4. API starts on `http://localhost:8080`

## Frontend setup (Member B)
1. Install Node.js and npm
2. From `frontend/`, run `npm install`
3. Run `npm run dev`

## Member focus
- **Member A** — Backend & DevOps (Spring Boot, Spring Security, JPA/Hibernate, MySQL, Redis, AI APIs, Docker, deployment)
- **Member B** — Frontend & UI (React, Tailwind CSS, Redux Toolkit, React Router, Axios, charts, responsive UI)
