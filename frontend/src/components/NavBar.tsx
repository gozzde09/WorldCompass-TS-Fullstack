import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("user");
  };
  return (
    <BootstrapNavbar
      style={{ backgroundColor: "#3d3b8e" }}
      expand='lg'
      variant='dark'>
      <Container>
        <BootstrapNavbar.Brand as={Link} to='/'>
          World Compass
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
        <BootstrapNavbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/' onClick={handleLogout}>
              Log out
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
