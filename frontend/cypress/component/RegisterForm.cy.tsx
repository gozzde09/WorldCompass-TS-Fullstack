import { BrowserRouter } from "react-router-dom";
import RegisterForm from "../../src/components/RegisterForm";

beforeEach(() => {
  cy.mount(
    <BrowserRouter>
      <RegisterForm />
    </BrowserRouter>
  );
});

describe("<RegisterForm />", () => {
  //FORM
  it("renders the registration form", () => {
    cy.get("#registerFirstName").should("exist");
    cy.get("#registerLastName").should("exist");
    cy.get("#registerEmail").should("exist");
    cy.get("#registerPassword").should("exist");
    cy.get("#register").should("exist");
  });

  //EMPTY
  it("should display validation errors for empty fields", () => {
    cy.get("#register").click();
    cy.get("#registerFirstName")
      .siblings(".invalid-feedback")
      .should("contain", "First name is required");
    cy.get("#registerLastName")
      .siblings(".invalid-feedback")
      .should("contain", "Last name is required");
    cy.get("#registerEmail")
      .siblings(".invalid-feedback")
      .should("contain", "Email is required");
    cy.get("#registerPassword")
      .siblings(".invalid-feedback")
      .should("contain", "Password is required");
  });

  //INVALID EMAIL
  it("should display validation error for invalid email", () => {
    cy.get("#registerEmail").type("invalid-email");
    cy.get("#register").click();
    cy.get("#registerEmail")
      .siblings(".invalid-feedback")
      .should("contain", "Invalid email address");
  });

  //SHORT PASSWORD
  it("should display error for short password", () => {
    cy.get("#registerPassword").type("123");
    cy.get("#register").click();
    cy.get("#registerPassword")
      .siblings(".invalid-feedback")
      .should("contain", "Password must be at least 4 characters");
  });

  // ERROR REGISTRATION -invalid
  it("should display error for registration failure", () => {
    // Mock failed registration response
    cy.intercept("POST", "/api/users", {
      statusCode: 400,
      body: { message: "Error with registration. Please try again!" },
    });

    cy.get("#registerFirstName").type("John");
    cy.get("#registerLastName").type("Doe");
    cy.get("#registerEmail").type("john.doe@example.com");
    cy.get("#registerPassword").type("password123");
    cy.get("#register").click();

    cy.get(".alert-danger").should(
      "contain",
      "Error with registration. Please try again!"
    );
  });

  // VALID
  it("should register successfully and redirect", () => {
    cy.get("#registerFirstName").type("John");
    cy.get("#registerLastName").type("Doe");
    cy.get("#registerEmail").type("john.doe@example.com");
    cy.get("#registerPassword").type("password123");
    cy.get("#register").click();

    cy.get(".alert-success").should(
      "contain",
      "You successfully registered! Redirecting to the homepage..."
    );
    cy.url().should("include", "/home");
  });
});
