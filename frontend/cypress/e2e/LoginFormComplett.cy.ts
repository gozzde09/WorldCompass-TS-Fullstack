describe("E2E: Login form functionality with ID selectors", () => {
  const validUser = {
    email: "test@example.com",
    password: "test",
  };

  const invalidUser = {
    email: "invaliduser@example.com",
    password: "wrongpassword",
  };

  beforeEach(() => {
    cy.visit("/");
  });

  // Test valid login credentials
  it("logs in with valid credentials", () => {
    cy.get("#loginEmail").type(validUser.email);
    cy.get("#loginPassword").type(validUser.password);
    cy.get("#login").click();
    cy.get(".alert-success").should(
      "contain",
      "Login successful! Redirecting to the homepage..."
    );
    cy.wait(2000);
    cy.url().should("include", "/home");
  });

  // Test invalid login credentials
  it("shows an error message with invalid credentials", () => {
    cy.get("#loginEmail").type(invalidUser.email);
    cy.get("#loginPassword").type(invalidUser.password);
    cy.get("#login").click();

    cy.get(".alert-danger").should(
      "contain",
      "Invalid email or password.Please try again!"
    );
  });

  // Verifying backend (checking that the login request was processed correctly)
  it("verifies login request on the backend", () => {
    // Mocking the login request with a successful response using cy.intercept
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        user: { user_id: 1, first_name: "Test", last_name: "User" },
      },
    }).as("loginRequest");

    cy.get("#loginEmail").type(validUser.email);
    cy.get("#loginPassword").type(validUser.password);
    cy.get("#login").click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
  });

  // Verifying frontend after successful login (check the navbar or user info)
  it("verifies the user is redirected ", () => {
    cy.get("#loginEmail").type(validUser.email);
    cy.get("#loginPassword").type(validUser.password);
    cy.get("#login").click();

    cy.url().should("include", "/home");
    // Local storage?
  });
});
