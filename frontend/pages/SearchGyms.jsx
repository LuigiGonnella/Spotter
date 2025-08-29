import { useEffect, useState } from "react";
import { findAllGyms } from "../src/api/gym.mjs";
import { Alert } from "react-bootstrap";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";

export function SearchGyms(props) {
    const [page, setPage] = useState(1);
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(null);

    async function findGyms(page=1, pageSize=20) {
            try {
            setLoading(true);
            const gyms = await findAllGyms(page, pageSize);
            setGyms(gyms);
            
            } catch (error) {
                <Alert variant="danger" dismissible className="shadow-sm border-0 fw-semibold">Error in processing gyms data</Alert>
            } finally {
                setLoading(false);
            }
            
        }

    useEffect(() => {
        findGyms();
    }, []);

    const [searchData, setSearchData] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div className="spinner-border text-dark" role="status" style={{width: "3rem", height: "3rem"}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5 text-secondary">Loading...</p>
      </div>
    </div>
    );
  }

  return (
    <Container className="py-3">
        
        <Row className="mb-3">
            <Button
            variant="outline-primary"
            className="mb-3"
            onClick={() => setShowFilters((prev) => !prev)}
            >
            {showFilters ? "Show filters" : "Hide filters"}
            </Button>
            <Form onSubmit={handleSearch} className="shadow-sm p-3 rounded bg-white">
            <Row className="g-2">
                <Col xs={12} md={6}>
                <Form.Control
                    type="text"
                    placeholder="Gym Name"
                    value={data.name}
                    onChange={e => setSearchData((prev) => prev.name=e.value)}
                    disabled={loading}
                />
                </Col>
                    {showFilters && (
                        <>
                 <Col xs={12} md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Indirizzo"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            disabled={loading}
                        />
                 </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Città"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            disabled={loading}
                        />
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Descrizione"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            disabled={loading}
                        />
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Select
                            value={verified}
                            onChange={e => setVerified(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Verificata?</option>
                            <option value="true">Sì</option>
                            <option value="false">No</option>
                        </Form.Select>
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            type="number"
                            placeholder="Latitudine"
                            value={latitude}
                            onChange={e => setLatitude(e.target.value)}
                            disabled={loading}
                        />
                        </Col>
                        <Col xs={12} md={6}>
                        <Form.Control
                            type="number"
                            placeholder="Longitudine"
                            value={longitude}
                            onChange={e => setLongitude(e.target.value)}
                            disabled={loading}
                        />
                        </Col>
                        </>
                    )}
                    <Col xs={12} className="d-grid mt-2">
                        <Button type="submit" variant="primary" disabled={loading}>
                            Cerca
                        </Button>
                    </Col>
                </Row>
            </Form>
           
        </Row>
            
      <Row>
        {gyms.length === 0 && !loading && (
          <Col className="text-center text-muted py-5">
            No gym found.
          </Col>
        )}
        {gyms.map((gym) => (
          <Col xs={12} md={6} lg={4} className="mb-3" key={gym.id}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Title>
                  <Button
                    variant="link"
                    className="fw-bold p-0 text-decoration-none"
                    style={{ fontSize: "1.2rem" }}
                    onClick={() => {/* TODO: navigate to gym page */}}
                  >
                    {gym.name}
                  </Button>
                </Card.Title>
                <Card.Text>
                  <span className="text-muted">{gym.city}</span>
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {/* TODO: send request */}}
                  >
                    Send Request
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {/* TODO: see info */}}
                  >
                    See Info
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-center align-items-center gap-2">
          <Button
            variant="outline-dark"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={onPrev}
          >
            Prev
          </Button>
          <span>
            Pagina {page} di {totalPages}
          </span>
          <Button
            variant="outline-dark"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={onNext}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
}




