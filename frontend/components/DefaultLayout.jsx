import { Alert, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router";
import NavHeader from "./NavHeader";
import Footer from "./Footer";

function DefaultLayout(props) {
  
  return(
    <div className="min-vh-100" style={{backgroundColor: '#ffffffff'}}>
      <NavHeader loggedIn={props.loggedIn} handleLogout={props.handleLogout} user={props.user} />
      <Container fluid className="py-1" style={{width: '100%'}}>
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
      <Footer></Footer>
    </div>
  );
}

export default DefaultLayout;
