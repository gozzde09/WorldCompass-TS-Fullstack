### GitHub Riktigt Privat Projekt Repo: https://github.com/gozzde09/TravelList-Countries-in-TS

# 03/12

- Skapade GitHub-repo med en enkel layout, installerade nödvändiga paket. Började med VG-kraven.
- Fixade Code Coverage men jag ska pusha den sist för att undvika för många push.
- Jobbar med GitHub Actions. Det blev för många misslyckade commits. Ska skapa ett TEST-repo för detta.

# 04/12

- Skapade tabeller.
- Skrev alla endpoints med nödvändiga CRUD operationer i Backend.
- Hämtade statik data för Countries-tabell och gjorde POST av alla länder i Frontend.
- Skapade en riktigt repo från gårdagens commits.

# 05/12

- Jobbade hela dagen för att fixa GitHub Actions med Docker Compose + database.
  Det känns som jag gör framsteg, men också lite tidsförlust. Ingen commit idag om testfilen.
  Mina misslyckade tester ligger här, i ett annat repo - hundratals... https://github.com/gozzde09/BookList-Cypress/actions
  Känner mig helt trött, inga fler commits idag.

- Docker-konfigurationer
- Skapade UML-diagram med Mermaid.

# 06/12

Efter fyra dagar, 10-12 timmar per dag – löste jag GitHub Actions. Datorn crashar ofta.
Det tog mycket tid, som ni kan se i mina test-repo: https://github.com/gozzde09/BookList-Cypress/actions
:)

- Bytte repo till privat
- Uppdaterade Docker-konfigurationer
- Skapade test.yml + skapade SECRETS i GitHub
- Justerade scripts
- Rättade databasen och kopplade den till frontend – skrev enkla fake tests.

# 09/12

Jag planerade att använda en karta för att visa besökta/vill besöka länder. Studerade och testade `leaflet`.
Testade att fetcha länder från API till databastabellen. Det blev en hel del rättning av POST-funktionerna.
Jag hade problem med att värdena hade för långa texter. Det tog tid idag.

- Commitade förbättringar för databasen
- TDD-testade en del med databasen
  Tester som misslyckades i Cypress-appen, passade i GitHub Actions. Galet!

# 10/12

- Router med `react-lazy-with-preload`
- Pages: Home & Login-Register
- Komponents NavBar & Footer
- Mappstruktur: pages-components-styles
- POST länder till database från API:s via en Hook ( det var inte lätt)

# 11/12

- Update POST länder med en Hook
- Get country by name --backend
- Konfiguration av BDD-Cucumber
- TDD-BDD tests for LoginForm
- Login endpoint with jsonwebtoken

# 12/12

- Login / Register sida med FlipCard

- LoginForm med Formik och Yup validering
- Updaterade BDD tester för LoginForm, id, alerts osv

- TDD-BDD tests for RegisterForm
- RegisterForm med Formik och Yup validering
- Lite CSS
- Fick göra denna installning :https://docs.cypress.io/api/cypress-api/catalog-of-events#Uncaught-Exceptions

# 13/12

- Automatiserade sparade länder via hook-API och sparade JSON-fil. Skickade JSON-data till databasen.
- Fixade Login och Register endpoints på riktigt
- Färdiga BDD tester för Login & Register
- Sparade userId i local storage, fixade logga ut function
- E2E kompletta tester för Login och Register

# 16/12

- Komponenttester och updaterade E2E komplett tester för Login och Register
- Local Storage - sparar ett user object med namn + id
- Skapade kartan som visar travel-list tabellen men pushade inte det än

# 17/12

- GET-POST-DELETE för TravelList
- Komponenter Karta, CountryModal, TravelList
- Komponenttest för TravelList

# 18/12

- Komplett E2E test för TravelList - DELETE
- CSS färger, margin osv
- Uppdaterade ER-Diagram
- Komponent and kompletta E2E tester för CountryDetailsModal -TravellList GET-POST-PUT
- Code Coverage

# 19/12

- Karusell för länder
- Typsnitt
- NavBar komponenttest

# 20/12 -21/12

- Margin, responsive design
- Släppte projektet på Azure
