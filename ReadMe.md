🌍 TravelList – World Compass
Users can register and log in to the app.
This app allows users to mark countries they have visited or want to visit on a map.

DEMO : https://worldcompass-ts-fullstack.onrender.com/

https://github.com/user-attachments/assets/f5c9957c-2956-4cce-9a97-13cb6752a06d

🛠️ Tools Used
- Docker Compose

- `BACKEND`
PostgreSQL -dotenv - pg
Node.js- Nodemon
Express - Cors
Json webtoken
Typescript
File System -fs

- `FRONTEND`
Typescript - React - Vite
React. Bootstrap - Icon - Router -Lazy- preload
Formik- Yup --validation
Leaflet --karta
Axios
Local Storage

- `TESTNING`
Cypress TDD - Komplett E2E- Component
Cucumber - BDD + TDD
Code Coverage
GitHub Actions

⚡ Installation
1- Run ´npm install´ manually in both frontend and backend directories.
2- Start Docker Desktop 🐳.
3- Run ´docker compose up --build -d´ in the project root folder.
Sometimes the database shows as unhealthy; if so, run the command again
4- The application will now be available at http://localhost/.
- Tests are written for this address.

🧪 Tests
1- Start Cypress a `npx cypress open` in the frontend folder.
2- Headless versions in the console in the frontend folder:
`npm run test:component --headless`
`npm run test:e2e`
3- Check GitHub Actions for automated testing.
4- Code coverage report is available in HTML (terminal may not show report via Docker).
Open at: `http://localhost/frontend/coverage/lcov-report/index.html`

