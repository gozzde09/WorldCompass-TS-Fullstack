### GitHub Riktigt Privat Projekt Repo: https://github.com/gozzde09/TravelList-Countries-in-TS

# 03/12

Skapade GitHub repo med en enkel layout, installerade nödvändiga paketer.Började med VG kräven.

- Fixade Code Coverage men jag ska pusha den sist, för att det blir för mycket push.
- Jobbar med GitHub actions. Det blev för mycket misslyckades commits. Ska ha en TEST repo för detta.

# 04/12

- Skapade tabeller.
- Skrev alla endpoints med nödvändiga CRUD operations i Backend.
- Hämtade static Countries data och gjorde POST alla länder i Frontend.
- Skapade en riktigt repo från igårs commitar.

# 05/12

Jobbade literally hela dagen för att fixa GitHub actions med `Docker compose + database`.
Det känns som jag gör framsteg men också lite tidslöseri. Inget commit blir idag heller om test file.
Men mina misslysckades tester ligger här, i en annan repo- hundratals...: https://github.com/gozzde09/BookList-Cypress/actions

Känner helt trött, inga mera CODE commit idag. kl.22.30

- Docker configurations
- Skapade UML diagram by Mermaid.

# 06/12

Efter fyra dagar, 10-12 timmar i dagen-- löste jag GitHub actions. Datorn crashar längre.
Det tog mycket tid som ni kan se i mina test repo:t https://github.com/gozzde09/BookList-Cypress/actions
:)

- Bytte repo:t till privat
- Updated Docker conf
- Skapade test.yml + skapade SECRETS i GitHub
- Script justeringar
- Rätta database och koppla den till frontend -- enkla fake tests

# 09/12

Jag planerade att använda en karta för att visa besökt / ska besöka länder. Studerade och testade `leaflet`.
Testade att fetcha länder från API till database tabellen. Det blev en hel del rättning kring POST funktioner. Jag hade problem med att values hade långa text. Det tog tid med mig idag.

- Commitar database förbättringar idag.
- TDD test en del med database
  Tester som failed i Cypress app, passed i GitHub actions. Galen!

# 10/12

- Router med `react-lazy-with-preload`
- Pages -Home & Login-Register
- Components NavBar & Footer
- Mapp structure med pages-components-styles
- POST länder till database from API:s via en Hook ( det var inte lätt)

# 11/12

- Update POST länder med en Hook
- Get country by name -backend
- Konfiguration BDD-Cucumber
- TDD-BDD tests for LoginForm
- Login endpoint with jsonwebtoken-bcryptjs

# 12/12

- Login / Regsiter sida med FlipCard
- LoginForm with Formik och Yup validering
- Updated BDD tests för LoginForm , id, alerts osv
- TDD-BDD tests for RegisterForm
- RegisterForm with Formik och Yup validering
- Lite CSS
- Fick göra denna installning :https://docs.cypress.io/api/cypress-api/catalog-of-events#Uncaught-Exceptions

# 13/12

- Automated sparade länder via hook-API och sparade satan i JSOn-file. Skickade JSON data till database.
- Fixade Login och Register nedpoinst på riktigt
- Färdiga BDD tester för
- Sparade userId i local storage, fixade logga ut function
- E2E komplett tester för Login och Register

# 16/12

- Komponent tester och updated E2E komplett tester för Login och Register
- Local Storage - sparar user object med namn
