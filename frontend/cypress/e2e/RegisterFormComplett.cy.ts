describe("E2E: User Registration Form", () => {
  const generateUniqueEmail = () => `user${Date.now()}@example.com`;

  const newUser = {
    first_name: "John",
    last_name: "Doe",
    email: generateUniqueEmail(),
    password: "password123",
  };

  beforeEach(() => {
    // Visit the registration page before each test
    cy.visit("/");
    cy.get(".flip-card-back")
      .invoke("css", "transform", "rotateY(0deg)")
      .should("be.visible");

    cy.get(".flip-card-back").should("be.visible");
  });

  // Test for successful registration
  it("registers a new user with valid data", () => {
    // Fill out the form using the 'id' attributes
    cy.get("#registerFirstName").type(newUser.first_name);
    cy.get("#registerLastName").type(newUser.last_name);
    cy.get("#registerEmail").type(newUser.email);
    cy.get("#registerPassword").type(newUser.password);
    // Submit the form
    cy.get("#register").click();

    // Verify success message appears
    cy.get(".alert-success").should(
      "contain",
      "You successfully registered! Redirecting to the homepage..."
    );

    // Verify that the user is redirected to the homepage
    cy.url().should("include", "/home");

    // Verify that the user ID is saved in localStorage
    cy.window().then((win) => {
      const userId = win.localStorage.getItem("userId");
      expect(userId).to.not.be.null;
    });
  });

  // Test for invalid email format
  it("shows an error message for invalid email format", () => {
    const invalidUser = { ...newUser, email: "invalid-email" };

    // Fill out the form with invalid email
    cy.get("#registerFirstName").type(invalidUser.first_name);
    cy.get("#registerLastName").type(invalidUser.last_name);
    cy.get("#registerEmail").type(invalidUser.email);
    cy.get("#registerPassword").type(invalidUser.password);

    // Submit the form
    cy.get("#register").click();

    // Check if the email validation error appears
    cy.get(".invalid-feedback").should("contain", "Invalid email address");
  });

  // Test for missing first name
  it("shows an error message when first name is not provided", () => {
    const invalidUser = { ...newUser, first_name: "" };

    // Fill out the form with missing first name

    cy.get("#registerLastName").type(invalidUser.last_name);
    cy.get("#registerEmail").type(invalidUser.email);
    cy.get("#registerPassword").type(invalidUser.password);

    // Submit the form
    cy.get("#register").click();

    // Check if the first name validation error appears
    cy.get(".invalid-feedback").should("contain", "First name is required");
  });

  // Test for backend request validation (mocked response)
  it("verifies that registration request hits the backend", () => {
    cy.intercept("POST", "/api/users", {
      statusCode: 201,
      body: { user: { user_id: 1, first_name: "John", last_name: "Doe" } },
    }).as("registerUser");

    // Fill out the form with valid data
    cy.get("#registerFirstName").type(newUser.first_name);
    cy.get("#registerLastName").type(newUser.last_name);
    cy.get("#registerEmail").type(newUser.email);
    cy.get("#registerPassword").type(newUser.password);

    // Submit the form
    cy.get("#register").click();

    // Wait for the backend call to finish and verify the request
    cy.wait("@registerUser").its("response.statusCode").should("eq", 201);

    // Verify that the user is redirected to the homepage
    cy.url().should("include", "/home");
  });

  // Test for backend failure scenario (server error)
  it("shows an error message when the backend fails", () => {
    cy.intercept("POST", "/api/users", {
      statusCode: 500,
      body: { message: "Server error" },
    }).as("registerUser");

    // Fill out the form with valid data
    cy.get("#registerFirstName").type(newUser.first_name);
    cy.get("#registerLastName").type(newUser.last_name);
    cy.get("#registerEmail").type(newUser.email);
    cy.get("#registerPassword").type(newUser.password);

    // Submit the form
    cy.get("#register").click();

    // Verify that the error message is shown
    cy.get(".alert-danger").should(
      "contain",
      "Error with registration. Please try again!"
    );
  });
});
