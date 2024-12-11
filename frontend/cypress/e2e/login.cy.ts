describe("Login Form E2E Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display login form with email and password inputs", () => {
    cy.get("form").within(() => {
      cy.get("input[name='email']").should("be.visible");
      cy.get("input[name='password']").should("be.visible");
      cy.get("button[type='submit']").contains("Login").should("be.visible");
    });
  });

  it("should successfully log in with valid credentials", () => {
    // Intercept the API call for login
    cy.intercept("POST", "/api/login", {
      statusCode: 200,
      body: {
        user: {
          email: "test@gcom",
          password: "test",
        },
      },
    }).as("loginRequest");

    cy.get("input[name='email']").type("test@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").click();

    // Verify redirection after successful login
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("should display an error message for invalid credentials", () => {
    cy.intercept("POST", "/api/login", {
      statusCode: 401,
      body: {
        message: "Invalid email or password.",
      },
    }).as("loginRequest");

    cy.get("input[name='email']").type("invalid@example.com");
    cy.get("input[name='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();

    // Wait for the API call and check for error message
    cy.wait("@loginRequest");
    cy.get(".text-danger").should("contain", "Invalid email or password.");
  });

  it("should validate required fields", () => {
    cy.get("button[type='submit']").click();

    // Check for validation messages
    cy.get("input[name='email']:invalid").should("exist");
    cy.get("input[name='password']:invalid").should("exist");
  });
});
