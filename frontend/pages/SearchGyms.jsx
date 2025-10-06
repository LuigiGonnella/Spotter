import { useEffect, useState } from "react";
import { findAllGyms, getUserGyms, joinGym } from "../src/api/gym.mjs";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { Link } from "react-router";

export function SearchGyms(props) {
    const [filteredGyms, setFilteredGyms] = useState([]);
    
    const [pagination, setPagination] = useState({
        page : 1,
        pageSize : 20,
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
    }, [pagination.page]);

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

    async function handleRequest(gymRequest) {
        try {
            if (props.user) {
                await joinGym(props.user.id, gymRequest.id);
                props.setMessage({msg: `Request sent successfully!`, type:'success'});
            }
            else {
                props.setMessage({msg: `Authentication required, please log in`, type:'danger'});
            }
            
        } catch (error) {
            props.setMessage({msg: `${error}`, type:'danger'});
        }
        
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
        <div className="search-gyms-container">
            <Container className="py-5">
                {/* Header Section */}
                <Row className="justify-content-center mb-5">
                    <Col md={8} className="text-center">
                        <div className="search-gyms-header">
                            <i className="bi bi-search search-gyms-header-icon"></i>
                            <h2 className="search-gyms-title">Find Your Perfect Gym</h2>
                            <p className="search-gyms-subtitle">
                                Discover gyms in your area and connect with the fitness community
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Search Form */}
                <Row className="justify-content-center mb-5">
                    <Col xs={12} md={10} lg={8}>
                        <Card className="search-gyms-form-card">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="search-gyms-form-title">
                                        <i className="bi bi-funnel me-2"></i>
                                        Search Filters
                                    </h4>
                                    <Button
                                        onClick={() => setShowFilters((prev) => !prev)}
                                        className={`btn-dark search-gyms-toggle-btn ${showFilters ? "active" : ""}`}
                                    >
                                        <i className={`bi ${showFilters ? "bi-eye-slash" : "bi-eye"} me-2`} />
                                        {showFilters ? "Hide Advanced" : "Show Advanced"}
                                    </Button>
                                </div>
                                
                                <Form onSubmit={handleSearch}>
                                    <Row className="g-3">
                                        {/* Primary Search Field */}
                                        <Col xs={12}>
                                            <InputGroup className="search-gyms-input-group">
                                                <InputGroup.Text className="search-gyms-input-icon">
                                                    <i className="bi bi-building" />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search by gym name..."
                                                    value={data.name}
                                                    onChange={e => {
                                                        setSearchData(prev => ({ ...prev, name: e.target.value }));
                                                        setFilteredGyms(gyms.filter(gym => 
                                                            gym.name.toLowerCase().startsWith(e.target.value.toLowerCase())
                                                        ));
                                                    }}
                                                    disabled={loading}
                                                    className="search-gyms-input search-gyms-input-primary"
                                                />
                                            </InputGroup>
                                        </Col>

                                        {/* Advanced Filters */}
                                        {showFilters && (
                                            <>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-geo-alt" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Address"
                                                            value={data.address}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, address: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => 
                                                                    gym.address.toLowerCase().startsWith(e.target.value.toLowerCase())
                                                                ));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-pin-map" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="City"
                                                            value={data.city}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, city: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => 
                                                                    gym.city.toLowerCase().startsWith(e.target.value.toLowerCase())
                                                                ));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-card-text" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Description"
                                                            value={data.description}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, description: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => 
                                                                    gym.description && gym.description.toLowerCase().startsWith(e.target.value.toLowerCase())
                                                                ));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-envelope" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Email"
                                                            value={data.email}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, email: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => 
                                                                    gym.email && gym.email.toLowerCase().startsWith(e.target.value.toLowerCase())
                                                                ));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-check2-circle" />
                                                        </InputGroup.Text>
                                                        <Form.Select
                                                            value={data.verified}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, verified: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => {
                                                                    if (e.target.value === 'true') {
                                                                        return gym.verified === true;
                                                                    } else if (e.target.value === 'false') {
                                                                        return gym.verified === false;
                                                                    } else {
                                                                        return true;
                                                                    }
                                                                }));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        >
                                                            <option value="">Verification Status</option>
                                                            <option value="true">Verified</option>
                                                            <option value="false">Unverified</option>
                                                        </Form.Select>
                                                    </InputGroup>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-compass" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Latitude"
                                                            value={data.latitude}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, latitude: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => 
                                                                    gym.latitude === e.target.value
                                                                ));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <InputGroup className="search-gyms-input-group">
                                                        <InputGroup.Text className="search-gyms-input-icon">
                                                            <i className="bi bi-compass" />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Longitude"
                                                            value={data.longitude}
                                                            onChange={e => {
                                                                setSearchData(prev => ({ ...prev, longitude: e.target.value }));
                                                                setFilteredGyms(gyms.filter(gym => 
                                                                    gym.longitude === e.target.value
                                                                ));
                                                            }}
                                                            disabled={loading}
                                                            className="search-gyms-input"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                    
                                    {/* Action Buttons */}
                                    <Row className="mt-4">
                                        <Col xs={12} md={6} className="d-grid mb-2">
                                            <Button
                                                disabled={loading}
                                                onClick={() => {
                                                    setSearchData({
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
                                                className="search-gyms-reset-btn btn-dark"
                                            >
                                                <i className="bi bi-arrow-clockwise me-2 btn-dark" />
                                                Reset All Filters
                                            </Button>
                                        </Col>
                                        <Col xs={12} md={6} className="d-grid mb-2">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="search-gyms-search-btn btn-dark"
                                            >
                                                <i className="bi bi-search me-2" />
                                                Search Gyms
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Results Section */}
                <Row className="justify-content-center">
                    <Col xs={12} md={10}>
                        {filteredGyms.length === 0 && !loading && (
                            <Card className="search-gyms-empty-card">
                                <Card.Body className="text-center py-5">
                                    <i className="bi bi-emoji-frown search-gyms-empty-icon"></i>
                                    <h5 className="search-gyms-empty-title">No gyms found</h5>
                                    <p className="search-gyms-empty-text">
                                        Try adjusting your search filters or check back later for new gyms.
                                    </p>
                                </Card.Body>
                            </Card>
                        )}
                        
                        <Row>
                            {filteredGyms.map((gym) => (
                                <Col xs={12} md={6} lg={4} className="mb-4" key={gym.id}>
                                    <Card className="search-gyms-gym-card">
                                        <Card.Body className="p-4">
                                            <div className="search-gyms-gym-header">
                                                <div className="search-gyms-gym-icon-wrapper">
                                                    <i className="bi bi-building search-gyms-gym-icon"></i>
                                                    {gym.verified && (
                                                        <div className="search-gyms-verified-badge">
                                                            <i className="bi bi-check-circle-fill"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="search-gyms-gym-info">
                                                    <h5 className="search-gyms-gym-name">{gym.name}</h5>
                                                    <p className="search-gyms-gym-location">
                                                        <i className="bi bi-geo-alt me-1"></i>
                                                        {gym.address}, {gym.city}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {gym.description && (
                                                <p className="search-gyms-gym-description">
                                                    {gym.description}
                                                </p>
                                            )}
                                            
                                            {gym.email && (
                                                <p className="search-gyms-gym-email">
                                                    <i className="bi bi-envelope me-1"></i>
                                                    {gym.email}
                                                </p>
                                            )}
                                            
                                            <div className="search-gyms-gym-actions">
                                                {console.log(MyGyms)}
                                                {MyGyms.some(myGym => myGym.id === gym.id) ? (
                                                    <Button
                                                        size="sm"
                                                        disabled
                                                        className="search-gyms-joined-btn"
                                                    >
                                                        <i className="bi bi-check-circle me-2"></i>
                                                        Already Joined
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {handleRequest(gym)}}
                                                        className="search-gyms-join-btn btn-dark"
                                                    >
                                                        <i className="bi bi-person-plus me-2"></i>
                                                        Join Gym
                                                    </Button>
                                                )}
                                               
                                                    <Link className="search-gyms-info-btn btn-dark fw-semibold" to={`/gyms/${gym.id}/info`} style={{borderRadius: '5px'}} state={{gym}}><h5 className="fw-bold mb-1 mygyms-gymname"></h5>
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    View Details</Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Pagination */}
                {filteredGyms.length > 0 && (
                    <Row className="mt-5">
                        <Col className="d-flex justify-content-center align-items-center gap-3">
                            {pagination.page > 1 && (
                                <Button
                                    disabled={pagination.page <= 1 || loading}
                                    onClick={onPrev}
                                    className="search-gyms-nav-btn"
                                >
                                    <i className="bi bi-chevron-left me-1"></i>
                                    Previous
                                </Button>
                            )}
                            
                            <div className="search-gyms-page-info">
                                <span className="search-gyms-page-text">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                            </div>
                            
                            {pagination.page < pagination.totalPages && (
                                <Button
                                    disabled={pagination.page >= pagination.totalPages || loading}
                                    onClick={onNext}
                                    className="search-gyms-nav-btn btn-dark"
                                >
                                    Next
                                    <i className="bi bi-chevron-right ms-1"></i>
                                </Button>
                            )}
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
}