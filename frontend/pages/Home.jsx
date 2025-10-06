import { Container, Row, Col, Card, Button, Badge, Image } from 'react-bootstrap';

function Home(props) {

    return (
        
        <div className="min-vh-100" style={{backgroundColor: '#ffffffff'}}>
        {console.log(props.gym)}    
        {console.log(props.user)}        
            {props.user && props.user.role==='ADMIN' && (
                <div>
                    <span className="badge bg-warning text-dark shadow-lg px-4 mb-1 fs-5 fw-bold" style={{
                        borderRadius: '18px',
                        fontSize: '1.25rem',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 16px rgba(255,193,7,0.18)',
                        border: '2px solid #fff',
                        textShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        background: 'linear-gradient(90deg, #ffd700 0%, #ecdf9aff 100%)',
                        color: '#111',
                        alignItems: 'center',
                    }}>
                        <i className="bi bi-shield-lock-fill me-2" style={{color: '#d4af37', fontSize: '1.5rem'}}></i>
                        ADMIN of {props.gym.name}
                    </span>
                </div>
            )}
            
            {/* Hero Section */}
            {!props.loggedIn && (
                <Row className="justify-content-center">
                        <Col className="text-center mt-5 mb-5 py-5" style={{backgroundColor: '#000000', color: '#ffffff', borderRadius : '16px'}} lg={6}>
                            <i className="bi bi-trophy-fill display-4 text-warning mb-3"></i>
                            <h3 className=" fw-bold mb-3">
                                Welcome to Spotter
                            </h3>
                            <p className="lead mb-4">
                                Your fitness community where gym bros connect, compete, and grow stronger together
                            </p>
                            
                                <Button 
                                    variant="warning" 
                                    size="lg" 
                                    className="fw-bold px-5 py-3"
                                    href="/auth"
                                >
                                    <i className="bi bi-person-plus me-2"></i>
                                    Join the Community
                                </Button>
                    
                        </Col>
                    </Row>
            )}

                {props.loggedIn ? (
                    // Logged in user dashboard
                    <Row>
                        {/* Left Sidebar - Quick Stats */}
                        <Col className="mb-4">
                            <Card className="shadow-sm border-0 mb-3">
                                <Card.Header style={{backgroundColor: '#000000', color: '#ffffff'}}>
                                    <h5 className="mb-0 fw-bold">
                                        <i className="bi bi-speedometer2 me-2"></i>
                                        Quick Stats
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Workouts This Week</span>
                                        <Badge bg="warning" text="dark" className="fw-bold">5</Badge>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Gym Bros</span>
                                        <Badge bg="dark" className="fw-bold">12</Badge>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-muted">Active Gyms</span>
                                        <Badge bg="secondary" className="fw-bold">2</Badge>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Streak</span>
                                        <Badge bg="success" className="fw-bold">🔥 7 days</Badge>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Active Gym Bros */}
                            <Card className="shadow-sm border-0">
                                <Card.Header style={{backgroundColor: '#000000', color: '#ffffff'}}>
                                    <h5 className="mb-0 fw-bold">
                                        <i className="bi bi-people me-2"></i>
                                        Active Gym Bros
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="d-flex align-items-center mb-2">
                                            <div 
                                                className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                                                style={{width: '32px', height: '32px'}}
                                            >
                                                <i className="bi bi-person text-white"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <small className="fw-semibold">Gym Bro {i}</small>
                                                <div className="text-success small">
                                                    <i className="bi bi-circle-fill me-1" style={{fontSize: '6px'}}></i>
                                                    Online now
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Main Feed */}
                        <Col lg={6} className="mb-4">
                            {/* Create Post */}
                            <Card className="shadow-sm border-0 mb-4">
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div 
                                            className="rounded-circle bg-dark me-3 d-flex align-items-center justify-content-center"
                                            style={{width: '40px', height: '40px'}}
                                        >
                                            <i className="bi bi-person text-white"></i>
                                        </div>
                                        <Button 
                                            variant="outline-secondary" 
                                            className="flex-grow-1 text-start py-2"
                                            style={{borderRadius: '25px'}}
                                        >
                                            What's your workout today, {props.user?.firstName || 'Gym Bro'}?
                                        </Button>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-around">
                                        <Button variant="outline-dark" size="sm">
                                            <i className="bi bi-camera me-1"></i>
                                            Photo
                                        </Button>
                                        <Button variant="outline-dark" size="sm">
                                            <i className="bi bi-trophy me-1"></i>
                                            Achievement
                                        </Button>
                                        <Button variant="outline-dark" size="sm">
                                            <i className="bi bi-people me-1"></i>
                                            Find Buddy
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Feed Posts */}
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="shadow-sm border-0 mb-4">
                                    <Card.Header className="bg-white border-0">
                                        <div className="d-flex align-items-center">
                                            <div 
                                                className="rounded-circle bg-warning me-3 d-flex align-items-center justify-content-center"
                                                style={{width: '40px', height: '40px'}}
                                            >
                                                <i className="bi bi-person text-dark"></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-bold">Mike "The Beast" Johnson</h6>
                                                <small className="text-muted">
                                                    <i className="bi bi-building me-1"></i>
                                                    PowerHouse Gym • 2 hours ago
                                                </small>
                                            </div>
                                            <Badge bg="success" className="ms-2">PR!</Badge>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <p className="mb-3">
                                            Just hit a new personal record! 💪 Bench pressed 225lbs for 3 reps! 
                                            The grind never stops! Who's ready to spot me for 235 next week? 
                                            #NewPR #BenchPress #SpotterCommunity
                                        </p>
                                        <div className="bg-light p-3 rounded mb-3">
                                            <div className="row text-center">
                                                <div className="col-4">
                                                    <div className="fw-bold text-warning fs-4">225</div>
                                                    <small className="text-muted">lbs</small>
                                                </div>
                                                <div className="col-4">
                                                    <div className="fw-bold text-warning fs-4">3</div>
                                                    <small className="text-muted">reps</small>
                                                </div>
                                                <div className="col-4">
                                                    <div className="fw-bold text-warning fs-4">🏆</div>
                                                    <small className="text-muted">New PR</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <Button variant="outline-dark" size="sm">
                                                <i className="bi bi-hand-thumbs-up me-1"></i>
                                                Like (24)
                                            </Button>
                                            <Button variant="outline-dark" size="sm">
                                                <i className="bi bi-chat me-1"></i>
                                                Comment (8)
                                            </Button>
                                            <Button variant="outline-dark" size="sm">
                                                <i className="bi bi-people me-1"></i>
                                                Spot Me
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>

                        {/* Right Sidebar */}
                        <Col lg={3} className="mb-4">
                            {/* Gym Leaderboard */}
                            <Card className="shadow-sm border-0 mb-3">
                                <Card.Header style={{backgroundColor: '#000000', color: '#ffffff'}}>
                                    <h5 className="mb-0 fw-bold">
                                        <i className="bi bi-trophy me-2"></i>
                                        Gym Leaderboard
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    {[
                                        { name: "Alex Thunder", exercise: "Deadlift", weight: "405 lbs", rank: 1 },
                                        { name: "Sarah Strong", exercise: "Squat", weight: "315 lbs", rank: 2 },
                                        { name: "Mike Beast", exercise: "Bench", weight: "225 lbs", rank: 3 }
                                    ].map((record, i) => (
                                        <div key={i} className="d-flex align-items-center mb-2">
                                            <Badge 
                                                bg={i === 0 ? "warning" : i === 1 ? "secondary" : "dark"} 
                                                className="me-2"
                                            >
                                                #{record.rank}
                                            </Badge>
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold small">{record.name}</div>
                                                <div className="text-muted small">{record.exercise}: {record.weight}</div>
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>

                            {/* Upcoming Events */}
                            <Card className="shadow-sm border-0">
                                <Card.Header style={{backgroundColor: '#000000', color: '#ffffff'}}>
                                    <h5 className="mb-0 fw-bold">
                                        <i className="bi bi-calendar-event me-2"></i>
                                        Upcoming Events
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-3">
                                        <div className="fw-semibold">Group Workout Session</div>
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            Today, 6:00 PM
                                        </small>
                                        <div className="small text-muted">PowerHouse Gym</div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="fw-semibold">Bench Press Challenge</div>
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            Tomorrow, 7:00 PM
                                        </small>
                                        <div className="small text-muted">Iron Paradise</div>
                                    </div>
                                    <Button variant="outline-dark" size="sm" className="w-100">
                                        View All Events
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    // Not logged in - showcase features
                    <Row className="justify-content-center">
                            <Row>
                                <Col md={4} className="mb-4">
                                    <Card className="h-100 shadow-sm border-0 text-center">
                                        <Card.Body className="p-4">
                                            <i className="bi bi-people-fill display-4 text-warning mb-3"></i>
                                            <h4 className="fw-bold">Find Gym Bros</h4>
                                            <p className="text-muted">
                                                Connect with like-minded fitness enthusiasts in your gym. 
                                                Find workout partners and build lasting friendships.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <Card className="h-100 shadow-sm border-0 text-center">
                                        <Card.Body className="p-4">
                                            <i className="bi bi-trophy-fill display-4 text-warning mb-3"></i>
                                            <h4 className="fw-bold">Track Progress</h4>
                                            <p className="text-muted">
                                                Log your workouts, set personal records, and compete 
                                                on gym leaderboards. Celebrate your achievements!
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <Card className="h-100 shadow-sm border-0 text-center">
                                        <Card.Body className="p-4">
                                            <i className="bi bi-chat-dots-fill display-4 text-warning mb-3"></i>
                                            <h4 className="fw-bold">Stay Connected</h4>
                                            <p className="text-muted">
                                                Chat with your gym community, share workout tips, 
                                                and motivate each other to reach new heights.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                    </Row>
                )}
        </div>
    );
}

export default Home;