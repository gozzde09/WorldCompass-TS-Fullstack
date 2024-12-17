import { User } from "../../src/types/interfaces";
const generateUniqueEmail = () => `newuser${Date.now()}@example.com`;

describe("CompleteE2E: Registration Form", () => {
  const newUser: User = {
    first_name: "John",
    last_name: "Complete",
    email: generateUniqueEmail(),
    password: "password123",
  };

  beforeEach(() => {
    cy.visit("/");

    cy.get(".flip-card-back")
      .invoke("css", "transform", "rotateY(0deg)")
      .should("be.visible");
  });
  // Registrerade and loggade användare rörelser i frontend
  it("verifies the user redirects to the homepage, sees welcome message and appears in te local storage on the FRONTEND", () => {
    cy.get("#registerFirstName").type(newUser.first_name);
    cy.get("#registerLastName").type(newUser.last_name);
    cy.get("#registerEmail").type(newUser.email);
    cy.get("#registerPassword").type(newUser.password);
    cy.get("#register").click();
    cy.wait(2500);
    cy.url().should("include", "/home");

    const firstName = newUser.first_name;
    cy.get("#welcome").should("contain", `Welcome,${firstName}!`);

    // Användare sparades i localStorage
    cy.window().then(() => {
      const storedUserString = localStorage.getItem("user");

      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      expect(storedUser).to.exist;
      expect(storedUser.userId).to.match(/^\d+$/); // Nummer
      expect(storedUser.userName).to.equal(newUser.first_name);
    });
  });

  // Backend & Database
  it("verifies the user has registered and exists in the DATABASE", () => {
    cy.request("GET", "/api/users").then((response) => {
      expect(response.status).to.eq(200);
      const users = response.body;
      const user = users.find((u: User) => u.email === newUser.email);

      expect(user).to.exist;
      expect(user.first_name).to.equal(newUser.first_name);
      expect(user.last_name).to.equal(newUser.last_name);
    });
  });
});
