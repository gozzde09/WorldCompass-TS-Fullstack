import { BrowserRouter } from "react-router-dom";
import LoginForm from "../../src/components/LoginForm";
beforeEach(() => {
  cy.mount(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
});
describe("<LoginForm />", () => {
  //FORM
  it("should render the login form", () => {
    cy.get("#loginForm").should("exist");
    cy.get("#loginEmail").should("exist");
    cy.get("#loginPassword").should("exist");
    cy.get("#login").should("exist");
  });

  //EMPTY
  it("should display validation errors for empty fields", () => {
    cy.get("#login").click();
    cy.get("#loginEmail")
      .siblings(".invalid-feedback")
      .should("contain", "Email is required");
    cy.get("#loginPassword")
      .siblings(".invalid-feedback")
      .should("contain", "Password is required");
  });

  //INVALID EMAIL
  it("should display validation error for invalid email", () => {
    cy.get("#loginEmail").type("invalid-email");
    cy.get("#login").click();
    cy.get("#loginEmail")
      .siblings(".invalid-feedback")
      .should("contain", "Invalid email address");
  });

  //SHORT PASSWORD
  it("should display validation error for short password", () => {
    cy.get("#loginPassword").type("123");
    cy.get("#login").click();
    cy.get(".invalid-feedback").should(
      "contain",
      "Password must be at least 4 characters"
    );
  });

  // ERROR LOGIN -invalid
  it("should display alert error for invalid credentials-wrong password", () => {
    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("wrongpassword");
    cy.get("#login").click();

    cy.get(".alert-danger").should(
      "contain",
      "Invalid email or password.Please try again!"
    );
  });

  //VALID
  it("should login successfully, show success alert and redirect", () => {
    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("test");
    cy.get("#login").click();

    cy.get(".alert-success").should(
      "contain",
      "Login successful! Redirecting to the homepage..."
    );
    cy.url().should("include", "/home");
  });
});
