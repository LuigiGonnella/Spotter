import { useEffect, useState } from "react";
import { findAllGyms, getUserGyms } from "../src/api/gym.mjs";
import { Alert } from "react-bootstrap";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";


export function SearchGyms(props) {
    const [filteredGyms, setFilteredGyms] = useState([]);

    

    const [pagination, setPagination] = useState({
        page : 1,
        pageSize : 1,
        total : 1,
        totalPages: 1,
        hasMore : false
    });
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(null);
    const [data, setSearchData] = useState({
    name: "",
    address: "",
    city: "",
    description: "",
    email: "",
    verified: "",
    latitude: "",
    longitude: ""
  });

    function onPrev() {
        setPagination(e => ({...e, page: e.page-1}));
    }

    function onNext() {
        setPagination(e => ({...e, page: e.page+1}));
    }

    async function findGyms(page=1, pageSize=pagination.pageSize, search=data) {
            try {
            setLoading(true);
            const {gyms, pagination, links} = await findAllGyms(page, pageSize, search);
            console.log(gyms);
            console.log(pagination);
            setGyms(gyms);
            setPagination(pagination);

            
            } catch (error) {
                props.setMessage({msg: `${error}`, type:'danger'});
            } finally {
                setLoading(false);
            }
            
        }

    useEffect(() => {
        findGyms(pagination.page, pagination.pageSize, data);
        console.log(gyms);
    }, [pagination.page]); //singolo campo va bene

    const [MyGyms, setMyGyms] = useState([]);
    
    useEffect(() => {
        async function fetchGyms() {
            try {
                if (props.user && props.user.id) {
                const gyms_loc = await getUserGyms(props.user.id);
                setMyGyms(gyms_loc);
            }
                
            } catch (error) {

                props.setMessage({msg: `${error}`, type:'danger'});
                
            }
            
        }
        fetchGyms();
    }, [props.user?.id]);

    useEffect(() => {
    setFilteredGyms(gyms);
    }, [gyms]);

  
    const [showFilters, setShowFilters] = useState(false);


    function handleSearch(e) {
        e.preventDefault();
        findGyms(pagination.page, pagination.pageSize, data);
    }

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
    <Container className="py-4 bg-white text-black">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={10} lg={8}>
          <Card className="searchgyms-card">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold mb-0">
                  <i className="bi bi-search me-2 searchgyms-icon" /> Find Your Gym
                </h3>
                <Button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`searchgyms-btn searchgyms-btn-filters ${showFilters ? "active" : ""}`}
                >
                  <i className={`bi ${showFilters ? "bi-funnel-fill" : "bi-funnel"} me-2 searchgyms-icon`} />
                  {showFilters ? "Hide filters" : "Show filters"}
                </Button>
              </div>
              <Form onSubmit={handleSearch} className="">
                <Row className="g-3">
                  <Col xs={12} md={6}>
                    <InputGroup>
                      <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-building searchgyms-icon" /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Gym Name"
                        value={data.name}
                        onChange={e => {
                            setSearchData(prev => ({ ...prev, name: e.target.value }));
                            setFilteredGyms( gyms.filter(gym => (gym.name.toLowerCase().includes(e.target.value.toLowerCase()))));
                        }}
                        disabled={loading}
                        className="searchgyms-input"
                      />
                    </InputGroup>
                  </Col>
                  {showFilters && (
                    <>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-geo-alt searchgyms-icon" /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Address"
                            value={data.address}
                            onChange={e => {setSearchData(prev => ({ ...prev, address: e.target.value }));
                            setFilteredGyms( gyms.filter(gym => (gym.address.toLowerCase().includes(e.target.value.toLowerCase()))));
                        }}
                            disabled={loading}
                            className="searchgyms-input"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-pin-map searchgyms-icon" /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="City"
                            value={data.city}
                            onChange={e => {setSearchData(prev => ({ ...prev, city: e.target.value }));
                            setFilteredGyms( gyms.filter(gym => (gym.city.toLowerCase().includes(e.target.value.toLowerCase()))));
                        }}
                            disabled={loading}
                            className="searchgyms-input"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-card-text searchgyms-icon" /></InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Description"
                            value={data.description}
                            onChange={e => {setSearchData(prev => ({ ...prev, description: e.target.value }));
                        setFilteredGyms( gyms.filter(gym => (gym.description.toLowerCase().includes(e.target.value.toLowerCase()))));}}
                            disabled={loading}
                            className="searchgyms-input"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-envelope searchgyms-icon" /></InputGroup.Text>
                          <Form.Control
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={e => {setSearchData(prev => ({ ...prev, email: e.target.value }));
                                setFilteredGyms( gyms.filter(gym => (gym.email.toLowerCase().includes(e.target.value.toLowerCase()))));
                            }
                            }
                            disabled={loading}
                            className="searchgyms-input"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-check2-circle searchgyms-icon" /></InputGroup.Text>
                          <Form.Select
                            type='text'
                            value={data.verified}
                            onChange={e => {setSearchData(prev => ({ ...prev, verified: e.target.value }));

                            setFilteredGyms( gyms.filter(gym => {
                                if (e.target.value === 'true') {
                                    return gym.verified === true;
                                }
                                else if (e.target.value == 'false') {
                                    return gym.verified === false;
                                }
                                else {
                                    return true;
                                }
                            }));
                        }}
                            disabled={loading}
                            className="searchgyms-input"
                          >
                            <option value="">Verified?</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </Form.Select>
                        </InputGroup>
                      </Col>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-compass searchgyms-icon" /></InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="Latitude"
                            value={data.latitude}
                            onChange={e => {setSearchData(prev => ({ ...prev, latitude: e.target.value }));
                        
                        setFilteredGyms( gyms.filter(gym => (gym.latitude===e.target.value)));}}
                            disabled={loading}
                            className="searchgyms-input"
                          />
                        </InputGroup>
                      </Col>
                      <Col xs={12} md={6}>
                        <InputGroup>
                          <InputGroup.Text className="searchgyms-input-icon"><i className="bi bi-compass searchgyms-icon" /></InputGroup.Text>
                          <Form.Control
                            type="number"
                            placeholder="Longitude"
                            value={data.longitude}
                            onChange={e => {setSearchData(prev => ({ ...prev, longitude: e.target.value }));
                        
                            setFilteredGyms( gyms.filter(gym => (gym.longitude===e.target.value.toLowerCase)));
                        }}
                            disabled={loading}
                            className="searchgyms-input"
                          />
                        </InputGroup>
                      </Col>
                    </>
                  )}
                  <Col xs={12} md={6} className="d-grid mt-2">
                    <Button
                      disabled={loading}
                      onClick={() => {setSearchData({
                        name: "",
                        address: "",
                        city: "",
                        description: "",
                        email: "",
                        verified: "",
                        latitude: "",
                        longitude: ""
                      });

                      setFilteredGyms(gyms);
                    }}
                      className="searchgyms-btn searchgyms-btn-reset"
                    >
                      <i className="bi bi-x-circle me-2 searchgyms-icon" />Reset filters
                    </Button>
                  </Col>
                  <Col xs={12} md={6} className="d-grid mt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="searchgyms-btn searchgyms-btn-search"
                    >
                      <i className="bi bi-search me-2 searchgyms-icon" />Search
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {filteredGyms.length === 0 && !loading && (
          <Col className="text-center text-muted py-5">
            <i className="bi bi-emoji-frown fs-1 mb-2 searchgyms-icon" />
            <div>No gym found.</div>
          </Col>
        )}
        {filteredGyms.map((gym) => (
          <Col xs={12} md={6} lg={4} className="mb-4" key={gym.id}>
            <Card className="searchgyms-card">
              <Card.Body>
                <Card.Title className="d-flex align-items-center gap-2">
                 
                    <i className="bi bi-building me-2 searchgyms-icon" />{gym.name}
                </Card.Title>
                <Card.Text>
                  <span className="text-muted"><i className="bi bi-pin-map me-1 searchgyms-icon" />{gym.city}</span>
                </Card.Text>
                <div className="d-flex gap-2 mt-2">
                  {MyGyms.includes(gym) ? (
                    <Button
                      size="sm"
                      disabled
                      className="searchgyms-btn searchgyms-btn-joined"
                    >
                      <i className="bi bi-check-circle me-1 searchgyms-icon" />Already Joined!
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {/* TODO: send request */}}
                      className="searchgyms-btn searchgyms-btn-request"
                    >
                      <i className="bi bi-person-plus me-1 searchgyms-icon" />Send Request
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {/* TODO: see info */}}
                    className="searchgyms-btn searchgyms-btn-info"
                  >
                    <i className="bi bi-info-circle me-1 searchgyms-icon" />Info
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-4">
        <Col className="d-flex justify-content-center align-items-center gap-2">
          {pagination.page > 1 && (
            <Button
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={onPrev}
              className="searchgyms-btn searchgyms-btn-nav"
            >
              <i className="bi bi-arrow-left searchgyms-icon" /> Prev
            </Button>
          )}
          <span className="fw-semibold px-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          {pagination.page < pagination.totalPages && (
            <Button
              size="sm"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={onNext}
              className="searchgyms-btn searchgyms-btn-nav"
            >
              Next <i className="bi bi-arrow-right searchgyms-icon" />
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}




