import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { Dumbbell } from "lucide-react";

function NavHeader(props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    props.handleLogout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" variant="dark" className="shadow-lg border-bottom border-secondary" style={{background:'#000000ff'}}>
      <Container fluid className="mx-auto col-10">
        {/* Logo linkato */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-white">
          <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dumbbell style={{ color: '#FFD700', fontSize: '2rem', marginRight: '0.5rem' }} />
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#FFD700' }} data-testid="footer-brand">Spotter</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-semibold text-light">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search-gyms" className="fw-semibold text-light">
                  <i className="bi bi-search me-2"></i>
                  Search Gyms
                </Nav.Link>
            {props.loggedIn && (
              <>
              {props.user.role != 'ADMIN' && 
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
              </>
                }
                <Nav.Link as={Link} to="/posts" className="fw-semibold text-light">
                  <i className="bi bi-chat-square-text me-1"></i>
                  Posts
                </Nav.Link>
                <Nav.Link as={Link} to="/chats" className="fw-semibold text-light">
                  <i className="bi bi-chat-dots me-1"></i>
                  Chats
                </Nav.Link>
                <Nav.Link as={Link} to= {props.user.role==='ADMIN' ? "/profile-admin" : '/profile-user'} className="fw-semibold text-light">
                  <i className="bi bi-person-circle me-1"></i>
                  Profile
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ms-auto">
              {props.loggedIn ? (
                <Button 
                  variant="outline-warning" 
                  onClick={handleLogout}
                  className="d-flex align-items-center fw-semibold w-auto ms-lg-3"
                  style={{ maxWidth: '200px', minWidth: 'unset' }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </Button>
              ) : (
                <Button 
                  variant="warning" 
                  as={Link} 
                  to="/auth"
                  className="d-flex align-items-center fw-semibold text-dark w-auto ms-lg-3"
                  style={{ maxWidth: '135px', minWidth: 'unset' }}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Join Spotter
                </Button>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;
