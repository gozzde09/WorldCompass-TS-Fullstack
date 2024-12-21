# TravelList World Compass

Användare kan registrera sig och logga in appen.
En app som låter användare välja sina besökta / vill besöka länder på kartan.

## Använda verktyg

Docker Compose

`BACKEND`
PostgreSQL -dotenv - pg
Node.js- Nodemon
Express - Cors
Json webtoken
Typescript
File System -fs

`FRONTEND`
Typescript - React - Vite
React. Bootstrap - Icon - Router -Lazy- preload
Formik- Yup --validation
Leaflet --karta
Axios
Local Storage

`TESTNING`
Cypress TDD - Komplett E2E- Component
Cucumber - BDD + TDD
Code Coverage
GitHub Actions

## Installation

1- Kör `npm install` manuellt i både frontend- och backend-mapparna.
2- Starta Docker Desktop.
3- Kör `docker compose up --build -d` i projektets root-mapp. Ibland database visas unhealthy, då kör bara igen kommandot. :)
4- Applikationen är nu tillgänglig på `http://localhost/`. Tester skrevs enligt denna adressen.
Ni kan logga in med
email: `test@example.com`
lösenord:`test`

## Tests

1- Starta Cypress genom att köra `npx cypress open` i i frontend mappen.
2- Eller headless versioner i consolen i frontend mappen :
`npm run test:component --headless`
`npm run test:e2e`
3- Ni kan kolla GitHub actions också.
4- Code Coverage rapport syns i html version, terminalen visar inte rapporten via command pga Docker, antar jag. Eftersom utan Docker funkade den, när jag testade.
`http://localhost/frontend/coverage/lcov-report/index.html`

# Gözde Akgün JSU23
