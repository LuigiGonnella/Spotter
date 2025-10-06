
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router';
import { getUserGyms, joinGym, getGym } from "../src/api/gym.mjs";
import { useState, useEffect } from 'react';


export default function GymInfo(props) {
	// Presentational: denser layout and stronger emphasis for key fields
    const {gymId} = useParams();
    const location = useLocation();
    const [gym, setGym] = useState(null);
    const [MyGyms, setMyGyms] = useState([]);
    
    
    

     useEffect(() => {
        
            async function fetchGyms() {
                try {
                    if (props.user && props.user.id) {
                        const gyms_loc = await getUserGyms(props.user.id); //to filter out the join gym button if we already joined 
                        setMyGyms(gyms_loc);
                    }
                } catch (error) {
                    props.setMessage({msg: `${error}`, type:'danger'});
                }
            }

            async function obtainGym(gymId) {
                try {
                    const gym_ = await getGym(gymId);
					console.log(gym_)
                    setGym(gym_);
                    
                } catch (error) {
                    props.setMessage({msg: `${error}`, type:'danger'});
                }
            }

            
            fetchGyms();
            obtainGym(gymId);
            
        }, []);

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


	return (
		<div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #fbfbfb 0%, #f1f3f5 100%)', paddingTop: 28, paddingBottom: 28 }}>
			<Container fluid style={{ maxWidth: 1200 }}>
				{/* Compact header */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div style={{
							width: 64,
							height: 64,
							borderRadius: 14,
							background: 'linear-gradient(135deg,#111 0%,#333 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
						}}>
							<i className="bi bi-building" style={{ color: '#FFD700', fontSize: 28 }}></i>
						</div>
						<div>
							<h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#111' }}>{gym?.gym?.name}</h1>
						</div>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<Badge style={{ background: 'linear-gradient(135deg,#28a745 0%,#20c997 100%)', color: '#fff', fontWeight: 800, padding: '10px 16px', borderRadius: 12, boxShadow: '0 6px 18px rgba(40,167,69,0.18)' }}>Verified</Badge>
					</div>
				</div>

				<Row style={{ gap: 18 }}>
					{/* Main column: details */}
					<Col lg={8} style={{ display: 'flex' }}>
						<Card className="border-0 w-100" style={{ borderRadius: 14, padding: 0, overflow: 'hidden', boxShadow: '0 8px 40px rgba(2,6,23,0.06)', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
							<Card.Header style={{ background: 'linear-gradient(90deg,#0f1720 0%,#1f2933 100%)', color: '#fff', paddingBottom: '0px',  }}>
								<Row>
									<Col sm={6} className="mb-3">
										<div style={{ color: '#ffc64bff', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Address</div>
										<div style={{ color: '#ffffffff', fontWeight: 700 }}>{gym?.gym?.address}</div>
										<div style={{ color: '#b1b1b1ff', marginTop: 6 }}>{gym?.gym?.city}</div>
									</Col>

									<Col sm={6} className="mb-3">
										<div style={{ color: '#ffc64bff', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Contact</div>
										<div style={{ color: '#ffffffff', fontWeight: 700 }}>{gym?.gym.email? gym.gym.email : 'No contacts yet'}</div>
									</Col>
								</Row>
                                
							</Card.Header>

							<Card.Body style={{ padding: '1rem 1.25rem' }}>
								

								<Row>
									<Col className="mb-3">
										<div style={{ color: '#888', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Description</div>
										<p style={{ margin: 0, color: '#444' }}>{gym?.description?  gym.description : 'No description yet'}</p>
									</Col>
								</Row>

								<Row style={{ marginTop: 12 }}>
									<Col sm={4} className="mb-2">
										<Link
											to={gym?.id ? `/gyms/${gym.id}/members` : '#'} //TODO members list
											state={{ gym: props?.gym || null }}
											style={{
												 background: 'linear-gradient(135deg,#28a745 0%,#20c997 100%)',
												color: '#fff',
												borderRadius: 10,
												padding: '12px',
												textAlign: 'center',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												minHeight: 72,
												width: '100%',
												textDecoration: 'none',
												boxShadow: '0 6px 18px rgba(20,140,153,0.12)'
											}}
										>
											{console.log(gymId)}
											<div style={{ fontSize: 18, fontWeight: 900 }}>{gym?.count ? gym.count : 'None'}</div>
											<div style={{ fontSize: 12 }}>Total Members</div>
										</Link>
									</Col>
									<Col sm={4} className="mb-2"> {/* presentational link styled as card */}
										<Link
											to={gym?.gym?.id ? `/gyms/${gym.gym.id}` : '#'}
											state={{ gym: gym || null }}
											style={{
												background: 'linear-gradient(135deg,#17a2b8 0%,#138496 100%)',
												color: '#fff',
												borderRadius: 10,
												padding: '12px',
												textAlign: 'center',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												minHeight: 72,
												width: '100%',
												textDecoration: 'none',
												boxShadow: '0 6px 18px rgba(20,140,153,0.12)'
											}}
										>
											<div style={{ fontSize: 18, fontWeight: 900 }}>89</div>
											<div style={{ fontSize: 12 }}>Total Posts</div>
										</Link>
									</Col>
								</Row>

								{/* Filler area to avoid large white gaps - decorative placeholders */}
								<Row style={{ marginTop: 18, gap: 12, flex: 1 }}>
									<Col sm={4} className="mb-2">
										<div style={{ background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)', borderRadius: 10, padding: 18, height: '100%', boxShadow: '0 6px 18px rgba(2,6,23,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
											<div style={{ color: '#666', fontSize: 13, fontWeight: 700 }}>Announcements</div>
											<div style={{ marginTop: 8, color: '#222', fontWeight: 700 }}>No announcements yet</div>
										</div>
									</Col>
									<Col sm={4} className="mb-2">
										<div style={{ background: 'linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)', borderRadius: 10, padding: 18, height: '100%', boxShadow: '0 6px 18px rgba(2,6,23,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
											<div style={{ color: '#666', fontSize: 13, fontWeight: 700 }}>Upcoming Events</div>
											<div style={{ marginTop: 8, color: '#222', fontWeight: 700 }}>No events scheduled</div>
										</div>
									</Col>
									<Col sm={4} className="mb-2">
                                                {MyGyms && gym && MyGyms.some(myGym => myGym.id === gym.gym.id) ? (
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
                                                        className="search-gyms-join-btn btn-warning justify-content-center display-flex"
                                                        text='#0000'
                                                        style={{fontSize:'1.3rem'}}
                                                    >
                                                        <i className="bi bi-person-plus me-2"></i>
                                                        Join Gym
                                                    </Button>
                                                )}
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>

					{/* Side column: admins, geolocation, PRs */}
					<Col lg={3} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						<Card className="border-0" style={{ borderRadius: 12, padding: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.04)' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
								<div>
									<strong style={{ fontWeight: 800 }}>Admins</strong>
									<div style={{ color: '#666', fontSize: 13 }}>Contacts with admin privileges</div>
								</div>
							</div>

							<ListGroup variant="flush">
								<ListGroup.Item className="d-flex justify-content-between align-items-center">
									<div>
										<div style={{ fontWeight: 800 }}>Mario Rossi</div>
										<small style={{ color: '#666' }}>mario.rossi@example.com</small>
									</div>
									<Badge bg="secondary">Owner</Badge>
								</ListGroup.Item>
								<ListGroup.Item className="d-flex justify-content-between align-items-center">
									<div>
										<div style={{ fontWeight: 800 }}>Luigi Bianchi</div>
										<small style={{ color: '#666' }}>luigi.bianchi@example.com</small>
									</div>
									<Badge bg="light" text="dark">Admin</Badge>
								</ListGroup.Item>
							</ListGroup>
						</Card>

						<Card className="border-0" style={{ borderRadius: 12, padding: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.04)' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
								<div>
									<strong style={{ fontWeight: 800 }}>Geolocation</strong>
									<div style={{ color: '#666', fontSize: 13 }}>Used for discovery</div>
								</div>
							</div>

							<div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
								<div>
									<div style={{ color: '#222', fontWeight: 800 }}>Lat</div>
									<div style={{ color: '#666' }}>40.7128</div>
								</div>
								<div>
									<div style={{ color: '#222', fontWeight: 800 }}>Lng</div>
									<div style={{ color: '#666' }}>-74.0060</div>
								</div>
							</div>
						</Card>

						<Card className="border-0" style={{ borderRadius: 12, padding: 12, boxShadow: '0 8px 30px rgba(2,6,23,0.04)', flex: '1 1 auto' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
								<div>
									<strong style={{ fontWeight: 800 }}>PR in this gym</strong>
									<div style={{ color: '#666', fontSize: 13 }}>Highlights</div>
								</div>
								<Badge bg="info">3</Badge>
							</div>

							<ListGroup variant="flush">
								<ListGroup.Item className="d-flex justify-content-between align-items-center">
									<div>
										<div style={{ fontWeight: 800 }}>Squat • 180kg</div>
										<small style={{ color: '#666' }}>Anna • 2025-04-12</small>
									</div>
									
								</ListGroup.Item>
								<ListGroup.Item className="d-flex justify-content-between align-items-center">
									<div>
										<div style={{ fontWeight: 800 }}>Deadlift • 200kg</div>
										<small style={{ color: '#666' }}>Marco • 2025-03-09</small>
									</div>
									
								</ListGroup.Item>
							</ListGroup>

						</Card>
					</Col>
				</Row>
			</Container>

			<style>{`
				/* Reduce default white gaps in this page */
				.list-group-item { padding-top: 10px; padding-bottom: 10px; }
				@media (max-width: 992px) {
					.container-fluid { padding-left: 16px; padding-right: 16px; }
				}
			`}</style>
		</div>
	);
}