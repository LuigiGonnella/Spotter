import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

function NavHeader(props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    props.handleLogout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" expand="lg" variant="dark" className="shadow"> {/* expand per burger menu su schermi small/medium*/}
      <Container fluid className="mx-auto col-10">
        {/* Logo linkato */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <i className="bi bi-dice-6 me-2"></i>
          Spotter
        </Navbar.Brand>        {/* Navigation items */}
        <div className="d-flex w-100 align-items-center">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-semibold">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            
            
            {props.loggedIn && (          
                <Nav.Link as={Link} to="/profile" className="fw-semibold">
                  <i className="bi bi-person-circle me-1"></i>
                  Profile
                </Nav.Link>
            )}
          </Nav>

          {/* bottoni sulla destra*/}
          <Nav className="ms-auto">
            {props.loggedIn ? (
              <Button 
                variant="outline-light" 
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </Button>
            ) : (
              <Button 
                variant="outline-light" 
                as={Link} 
                to="/auth"
                className="d-flex align-items-center"
              >
                <i className="bi bi-person-circle me-1"></i>
                Login
              </Button>)}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
