import { Link } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("userId");
  };
  return (
    <BootstrapNavbar bg='dark' variant='dark' expand='lg'>
      <Container>
        <BootstrapNavbar.Brand as={Link} to='/'>
          World Compass
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls='basic-navbar-nav' />
        <BootstrapNavbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/home'>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to='/'>
              Login/Register
            </Nav.Link>
            <Nav.Link as={Link} to='/' onClick={handleLogout}>
              Log out
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
