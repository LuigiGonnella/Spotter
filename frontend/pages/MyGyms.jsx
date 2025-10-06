import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import "../src/App.css";
import { getUserGyms } from "../src/api/gym.mjs";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export default function MyGyms(props) {
    const navigate = useNavigate();
    const [gyms, setGyms] = useState([]);

    useEffect(() => {
        async function fetchGyms() {
            if (props.user && props.user.id) {
                const gyms_loc = await getUserGyms(props.user.id);
                setGyms(gyms_loc);
            }
        }
        fetchGyms();
    }, [props.user?.id]);

    return (
        <Container className="mygyms-container py-5">
            <Row className="justify-content-center mb-4">
                <Col md={8} className="text-center">
                    <h2 className="mygyms-title fw-bold mb-3">Your Gyms</h2>
                    <p className="mygyms-subtitle text-muted">Here are the gyms you belong to. Stay connected and track your progress!</p>
                </Col>
            </Row>
            <Row className="justify-content-center mb-4">
                <Col md={8} className="text-center">
                    <Button className="mygyms-subscribe-btn fw-bold px-4 py-2" onClick={() => navigate('/search-gyms')}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Subscribe to a new gym
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={8}>
                    {gyms.length === 0 ? (
                        <Card className="mygyms-card-empty text-center p-4">
                            <Card.Body>
                                <i className="bi bi-building fs-1 text-warning mb-3"></i>
                                <h5 className="fw-bold mb-2">No gyms found</h5>
                                <p className="text-muted">You are not subscribed to any gym yet.</p>
                            </Card.Body>
                        </Card>
                    ) : (
                        gyms.map((gym) => (

                            <Card key={gym.id} className="mygyms-card mb-4 shadow-sm border-0">
                                {console.log(gym)}
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="bi bi-building fs-2 text-warning me-3"></i>
                                        <div>
                                            <Link className="btn btn-outline-dark  fw-semibold" to={`/gyms/${gym.id}/info`} style={{borderRadius: '10px'}} state={{gym}}><h5 className="fw-bold mb-1 mygyms-gymname"> {gym.name}</h5></Link>
                                            <div className="text-muted small">{gym.address}, {gym.city}</div>
                                        </div>
                                    </div>
                                    <div className="mygyms-description mb-2">{gym.description || "No description available."}</div>
                                    <div className="mygyms-email text-muted small"><i className="bi bi-envelope me-1"></i>{gym.email}</div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
}