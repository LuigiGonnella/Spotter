import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { Container, Row, Col, Card, Button, Badge, Image } from 'react-bootstrap'
import { getUserGymsApi, updateGymMembershipApi } from "../src/api/gym.mjs"

export default function GymMembers(props) {

    const [members,  setMembers] = useState([])
    const [pagination,  setPagination] = useState()
    const location = useLocation()
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getMembers() {
            console.log(location.state.gym)
            try {
                setLoading(true)
                const members_pagination = await getUserGymsApi(location?.state?.gym?.id, {status: 'ACCEPTED' });                
                setMembers(members_pagination.members)
                setPagination(members_pagination.pagination)
                setLoading(false)
            } catch (err) {
                props.setMessage({msg: `${err}`, type:'danger'})
                setMembers([])
                setLoading(false)
            }
        }

        getMembers();
        console.log(members)
        
    }, [])

    async function HandleRemove(userId) {
        try {
            let update = await updateGymMembershipApi(userId, location?.state?.gym?.id, {isActive: 'DECLINED'});
            setMembers((prev) => prev.filter((s) => s.id == update.id))
            props.setMessage({ msg: 'User removed', type: 'success' });

        }
        catch (error) {
            const errorMsg = error?.message || String(error) || 'Unknown error';

            props.setMessage({ msg: errorMsg, type: 'danger' });
        }
    }

    async function HandleMessageToUser(userId) {
        //TODO
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
        <Container className="py-4">
            <Row>
              <Col>
                <div style={{ display: 'flex', justifyContent: 'left', marginBottom: 16 }}>
                  <h3 style={{
                    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                    color: '#FFD700',
                    padding: '14px 28px',
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: '1.6rem',
                    boxShadow: '0 10px 30px rgba(2,6,23,0.12)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    margin: 0
                  }}>
                    <i className="bi bi-people-fill" style={{ fontSize: '1.4rem' }}></i>
                    Members
                  </h3>
                </div>
              </Col>
                 
            </Row>
            {console.log(members)}

            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                {members.length === 0 && (
                    <Col>
                        <Card className="p-4 text-center">
                            No members found.
                        </Card>
                    </Col>
                )}

                {members.map((m) => (
                    <Col key={m.id ?? m.user?.id ?? JSON.stringify(m).slice(0,8)}>
                        <Card className="h-100">
                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex align-items-center mb-3">
                                    <div style={{width:56,height:56,borderRadius:'50%',overflow:'hidden',background:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',marginRight:12}}>
                                        {m.user?.avatar ? (
                                            <Image src={m.user.avatar} roundedCircle style={{width:'100%',height:'100%',objectFit:'cover'}} />
                                        ) : (
                                            <i className="bi bi-person-circle" style={{fontSize:28,color:'#6c757d'}}></i>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{fontWeight:700}}>{m.user?.firstName ? `${m.user.firstName} ${m.user.lastName ?? ''}` : m.user?.email ?? m.email ?? 'Unknown'}</div>
                                        <div className="text-muted" style={{fontSize:13}}>{m.user?.email ?? m.email}</div>
                                    </div>
                                </div>

                                <div className="mt-auto d-flex gap-2">
                                    <Button type="button" variant="outline-primary" className="flex-grow-1" aria-label="Message user" onClick={() => HandleMessageToUser(m.user.id)}>
                                        <i className="bi bi-chat-dots me-2"></i>
                                        Message
                                    </Button>
                                    <Button type="button" variant="outline-danger" className="flex-grow-1" aria-label="Remove user" onClick={() => HandleRemove(m.user.id)}>
                                        <i className="bi bi-person-dash me-2"></i>
                                        Remove
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {members.length > 0 && (
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
    )
}