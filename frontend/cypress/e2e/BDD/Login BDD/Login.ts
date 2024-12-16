import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const validCredentials = {
  email: "test@example.com",
  password: "test",
};

const invalidCredentials = {
  email: "invalid@example.com",
  password: "wrongpassword",
};

Given("I visit the login page", () => {
  cy.visit("/");
});

When("I enter valid email and password", () => {
  cy.get("#loginEmail").type(validCredentials.email);
  cy.get("#loginPassword").type(validCredentials.password);
});

When("I enter an invalid email and password", () => {
  cy.get("#loginEmail").type(invalidCredentials.email);
  cy.get("#loginPassword").type(invalidCredentials.password);
});

When("I click the login button", () => {
  cy.get("#login").click();
});

Then("I should see a success message", () => {
  cy.contains("Login successful! Redirecting to the homepage...").should(
    "be.visible"
  );
});

Then("I should be redirected to the home page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
});

Then("I should see an error message", () => {
  cy.contains("Invalid email or password.Please try again!").should(
    "be.visible"
  );
});
