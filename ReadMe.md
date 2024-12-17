# React + TypeScript + Vite + Cypress tester

## Installation

1-Kör `npm install` manuellt i både frontend- och backend-mapparna, om det behövs.
2-Starta Docker Desktop.
3-Kör `docker compose up --build -d` i projektets root-mapp. Ibland database visas unhealthy, då kör bara igen kommandot. :)
4-Applikationen är nu tillgänglig på `http://localhost/`. Tester skrevs enligt denna adressen.
5-Starta Cypress genom att köra `npx cypress open` i terminalen.
6- Eller headless versioner i consolen i frontend mappen :
`npm run test:component --headless`
`npm run test:e2e`

# Gözde Akgün JSU23
