import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const generateUniqueEmail = () => `user2${Date.now()}@example.com`;
const validUser = {
  first_name: "John",
  last_name: "Doe",
  email: generateUniqueEmail(),
  password: "secret",
};

const invalidUser = {
  email: "invalid-email",
};

Given("I visit the registration page", () => {
  cy.visit("/");
  cy.get(".flip-card-back")
    .invoke("css", "transform", "rotateY(0deg)")
    .should("be.visible");
});

When("I fill out the form with valid details", () => {
  cy.get("#registerFirstName").type(validUser.first_name);
  cy.get("#registerLastName").type(validUser.last_name);
  cy.get("#registerEmail").type(validUser.email);
  cy.get("#registerPassword").type(validUser.password);
});

When("I submit the form with missing required fields", () => {
  cy.get("#registerEmail").type(validUser.email);
  cy.get("#register").click();
});

When("I submit the form with an invalid email", () => {
  cy.get("#registerFirstName").type(validUser.first_name);
  cy.get("#registerLastName").type(validUser.last_name);
  cy.get("#registerEmail").type(invalidUser.email);
  cy.get("#registerPassword").type(validUser.password);
  cy.get("#register").click({ force: true });
  cy.wait(3000);
});

When("I click the register button", () => {
  cy.get("#register").click();
});

Then("I should see a success message", () => {
  cy.contains(
    "You successfully registered! Redirecting to the homepage..."
  ).should("be.visible");
});

Then("I should be redirected to the home page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
});

Then("I should see validation error messages", () => {
  cy.get(".invalid-feedback").should("be.visible");
});

Then("I should see a validation error for the email field", () => {
  cy.get(".invalid-feedback")
    .contains("Invalid email address")
    .should("be.visible");
});
