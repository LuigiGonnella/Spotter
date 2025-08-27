import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

function NavHeader(props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    props.handleLogout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="shadow-lg border-bottom border-secondary"> {/* expand per burger menu su schermi small/medium*/}
      <Container fluid className="mx-auto col-10">
        {/* Logo linkato */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
          <i className="bi bi-trophy-fill me-2 text-warning"></i>
          Spotter
        </Navbar.Brand>
        
        {/* Navigation items */}
        <div className="d-flex w-100 align-items-center">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-semibold text-light">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            
            {props.loggedIn && (
              <>
                <Nav.Link as={Link} to="/my-gyms" className="fw-semibold text-light">
                  <i className="bi bi-building me-1"></i>
                  My Gyms
                </Nav.Link>
                <Nav.Link as={Link} to="/workout-plans" className="fw-semibold text-light">
                  <i className="bi bi-clipboard-data me-1"></i>
                  Workout Plans
                </Nav.Link>
                <Nav.Link as={Link} to="/gym-bros" className="fw-semibold text-light">
                  <i className="bi bi-people me-1"></i>
                  Gym Bros
                </Nav.Link>
                <Nav.Link as={Link} to="/posts" className="fw-semibold text-light">
                  <i className="bi bi-chat-square-text me-1"></i>
                  Posts
                </Nav.Link>
                <Nav.Link as={Link} to="/chats" className="fw-semibold text-light">
                  <i className="bi bi-chat-dots me-1"></i>
                  Chats
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="fw-semibold text-light">
                  <i className="bi bi-person-circle me-1"></i>
                  Profile
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* bottoni sulla destra*/}
          <Nav className="ms-auto">
            {props.loggedIn ? (
              <Button 
                variant="outline-warning" 
                onClick={handleLogout}
                className="d-flex align-items-center fw-semibold"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </Button>
            ) : (
              <Button 
                variant="warning" 
                as={Link} 
                to="/auth"
                className="d-flex align-items-center fw-semibold text-dark"
              >
                <i className="bi bi-person-circle me-1"></i>
                Join Spotter
              </Button>)}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
