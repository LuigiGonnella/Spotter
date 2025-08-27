import { Alert, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";

function DefaultLayout(props) {
  
  return(
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <NavHeader loggedIn={props.loggedIn} handleLogout={props.handleLogout} user={props.user} />
      <Container fluid className="py-4" style={{maxWidth: '1200px'}}>
        {props.message && <Row>
          <Alert 
            variant={props.message.type} 
            onClose={() => props.setMessage('')} 
            dismissible
            className="shadow-sm border-0 fw-semibold"
          > 
            {props.message.msg} 
          </Alert>
        </Row>}
        <Outlet /> {/* Outlet per renderizzare le pagine figlie come Home, Game, Profile, etc. */}
      </Container>
    </div>
  );
}

export default DefaultLayout;
