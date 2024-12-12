import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const validCredentials = {
  email: "test@g.com",
  password: "test",
};

const invalidCredentials = {
  email: "invalid@example.com",
  password: "wrongpassword",
};

Given("I visit the login page", () => {
  cy.visit("/");
});

When("I enter a valid email and password", () => {
  cy.get("input[name='email']").type(validCredentials.email);
  cy.get("input[name='password']").type(validCredentials.password);
});

When("I enter an invalid email and password", () => {
  cy.get("input[name='email']").type(invalidCredentials.email);
  cy.get("input[name='password']").type(invalidCredentials.password);
});

When("I click the login button", () => {
  cy.get("#login").click();
});

Then("I should see home page", () => {
  cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
});

Then("I should see the error message", () => {
  cy.contains("Invalid email or password.").should("be.visible");
});
