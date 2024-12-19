import { BrowserRouter } from "react-router-dom";

import NavBar from "../../src/components/NavBar";

const testUser = {
  userId: 7,
  firstName: "TestUser",
};
describe("Navbar", () => {
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(testUser));
    cy.mount(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
  });

  it("should render the Navbar with the correct title", () => {
    cy.get(".navbar-brand").should("contain.text", "World Compass");
  });

  it("should clear userId from localStorage when Log out is clicked", () => {
    const storedUserString = localStorage.getItem("user");

    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    expect(storedUser).to.exist;

    expect(storedUser.userId).to.equal(7);
    expect(storedUser.firstName).to.equal(testUser.firstName);
    cy.get("a.nav-link").contains("Log out").click();

    cy.window().then(() => {
      const storedUserString = localStorage.getItem("user");
      expect(storedUserString).to.be.null;
    });
  });
});
