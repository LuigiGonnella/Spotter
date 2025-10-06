import { useState } from 'react';
import { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs, Modal, Form, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getUserGymsApi, updateGymMembershipApi } from '../src/api/gym.mjs';
import { Link } from 'react-router';

export default function ProfileAdmin(props) {
    const navigate = useNavigate();
    console.log('ProfileAdmin render - props.gym =', props.gym);
    // initialize as object with members array to avoid `.map` errors in render
    const [memberships, setMemberships] = useState({ members: [], pagination: null });


    useEffect(() => {
        async function getMemberships() {
            try {
                console.log('ProfileAdmin: getMemberships called, gym id =', props.gym?.id);
                if (!props.gym?.id) {
                    console.log('ProfileAdmin: gym id not available yet, skipping API call');
                    return;
                }
                const membs = await getUserGymsApi(props.gym.id, { page: 1, pageSize: 3, status: 'PENDING' }); // take first three to show in preview
                console.log('ProfileAdmin: API returned memberships ->', membs);
                setMemberships(membs || { members: [], pagination: null  });
            } catch (error) {
                console.error('ProfileAdmin: error fetching memberships', error);
                if (props.setMessage) props.setMessage({ msg: error, type: 'danger' });
            }
        }

        getMemberships();
    }, [props.gym?.id]);

   

    async function handleAccept(memb) {
        try {
            setMemberships(prev => ({...prev, members: prev.members.filter(member => member!=memb)}))
            let _ = await updateGymMembershipApi(memb.user.id, memb.gymId, {isActive: 'ACCEPTED'});
            props.setMessage({ msg: 'Request accepted', type: 'success' });

        }
        catch (error) {
            const errorMsg = error?.message || String(error) || 'Unknown error';

            props.setMessage({ msg: errorMsg, type: 'danger' });
        }
    }

    async function handleReject(memb) {
        try {
            setMemberships(prev => ({...prev, members: prev.members.filter(member => member!=memb)}))
            let _ = await updateGymMembershipApi(memb.user.id, memb.gymId, {isActive: 'DECLINED'});
            props.setMessage({ msg: 'Request rejected', type: 'info' });

        } catch (error) {
            const errorMsg = error?.message || String(error) || 'Unknown error';

            props.setMessage({ msg: errorMsg, type: 'danger' });

        }

        
    }


    return (
        <>
        {console.log(props.gym)}
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #f8f9fa 100%)' }}>
            <Container className="py-5">
                {/* Semicircle Dashboard Layout */}
                <div style={{ position: 'relative', minHeight: '500px', marginBottom: '3rem' }}>
                    {/* Central Title */}
                    <div style={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        zIndex: 10
                    }}>
                        <div 
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                borderRadius: '25px',
                                width: '100px',
                                height: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)'
                            }}
                        >
                            <i className="bi bi-shield-lock-fill" style={{ fontSize: '3rem', color: '#111' }}></i>
                        </div>
                        <h1 style={{ 
                            fontSize: '3.2rem', 
                            fontWeight: '900', 
                            color: '#111', 
                            marginBottom: '0.5rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            Gym Admin Dashboard
                        </h1>
                        <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '1rem' }}>
                            Manage your gym community and members
                        </p>
                        <div 
                            style={{
                                background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                color: '#FFD700',
                                padding: '12px 24px',
                                borderRadius: '30px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            <i className="bi bi-building me-2"></i>
                            {props.gym?.name || 'Your Gym Name'}
                        </div>
                    </div>

                    {/* Semicircle Cards */}
                    {/* Top Left - Total Members */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '15%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '25px', 
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: '#fff',
                            boxShadow: '0 12px 40px rgba(40, 167, 69, 0.4)',
                            transition: 'all 0.3s ease',
                            width: '150px',
                            height: '180px'
                        }}>
                            <Card.Body className="text-center py-4">
                                <i className="bi bi-people-fill" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}></i>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>142</h3>
                                <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0, opacity: 0.95 }}>Total Members</p>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Top Right - Pending Requests */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        right: '15%',
                        transform: 'translate(50%, -50%)'
                    }}>
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '25px', 
                            background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                            color: '#fff',
                            boxShadow: '0 12px 40px rgba(255, 193, 7, 0.4)',
                            transition: 'all 0.3s ease',
                            width: '150px',
                            height: '180px',
                        }}>
                            <Card.Body className="text-center py-4">
                                <i className="bi bi-clock-fill" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}></i>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>23</h3>
                                <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0, opacity: 0.95 }}>Pending Requests</p>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Bottom Left - Total Posts */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '15%',
                        transform: 'translate(-50%, 50%)'
                    }}>
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '25px', 
                            background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                            color: '#fff',
                            boxShadow: '0 12px 40px rgba(111, 66, 193, 0.4)',
                            transition: 'all 0.3s ease',
                            width: '150px',
                            height: '180px',
                            marginBottom: '60px'
                        }}>
                            <Card.Body className="text-center py-4">
                                <i className="bi bi-chat-square-text-fill" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}></i>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>89</h3>
                                <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0, opacity: 0.95 }}>Total Posts</p>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Bottom Right - Workout Plans */}
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '15%',
                        transform: 'translate(50%, 50%)'
                    }}>
                        <Card style={{ 
                            border: 'none', 
                            borderRadius: '25px', 
                            background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
                            color: '#fff',
                            boxShadow: '0 12px 40px rgba(220, 53, 69, 0.4)',
                            transition: 'all 0.3s ease',
                            width: '150px',
                            height: '180px',
                            marginBottom: '60px'
                        }}>
                            <Card.Body className="text-center py-4">
                                <i className="bi bi-clipboard-data-fill" style={{ fontSize: '2.8rem', marginBottom: '1rem' }}></i>
                                <h3 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>23</h3>
                                <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0, opacity: 0.95 }}>Workout Plans</p>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Tabs 
                            defaultActiveKey="overview" 
                            className="mb-4"
                            style={{
                                borderBottom: '2px solid #f0f0f0'
                            }}
                        >
                            {/* Overview Tab */}
                            <Tab 
                                eventKey="overview" 
                                title={
                                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                        <i className="bi bi-speedometer2 me-2"></i>
                                        Overview
                                    </span>
                                }
                            >
                                <Row>
                                    {/* Gym Info Card */}
                                    <Col lg={6} className="mb-4">
                                        <Card 
                                            className="h-100 border-0"
                                            style={{
                                                background: '#fff',
                                                borderRadius: '18px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <Card.Header 
                                                className="border-0"
                                                style={{
                                                    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                                    color: '#fff',
                                                    borderRadius: '18px 18px 0 0',
                                                    padding: '1.5rem'
                                                }}
                                            >
                                                <h5 style={{ marginBottom: '0', fontWeight: '700', fontSize: '1.3rem' }}>
                                                    <i className="bi bi-building me-2"></i>
                                                    Gym Information
                                                </h5>
                                            </Card.Header>
                                            <Card.Body className="p-4">
                                                <div className="mb-3">
                                                    <strong style={{ color: '#111', fontSize: '1rem' }}>Name:</strong>
                                                    <p style={{ marginBottom: '0.5rem', marginTop: '0.25rem', color: '#555' }}>
                                                        {props.gym?.name || 'PowerHouse Gym'}
                                                    </p>
                                                </div>
                                                <div className="mb-3">
                                                    <strong style={{ color: '#111', fontSize: '1rem' }}>Address:</strong>
                                                    <p style={{ marginBottom: '0.5rem', marginTop: '0.25rem', color: '#555' }}>
                                                        {props.gym?.address || '123 Fitness Street'}, {props.gym?.city || 'New York'}
                                                    </p>
                                                </div>
                                                <div className="mb-3">
                                                    <strong style={{ color: '#111', fontSize: '1rem' }}>Description:</strong>
                                                    <p style={{ marginBottom: '0.5rem', marginTop: '0.25rem', color: '#555' }}>
                                                        {props.gym?.description || 'A premium fitness facility with state-of-the-art equipment and professional trainers.'}
                                                    </p>
                                                </div>
                                                <div className="mb-4">
                                                    <strong style={{ color: '#111', fontSize: '1rem' }}>Status:</strong>
                                                    <Badge 
                                                        className="ms-2"
                                                        style={{
                                                            background: props.gym?.verified ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                                                            color: '#fff',
                                                            fontSize: '0.9rem',
                                                            padding: '6px 12px',
                                                            borderRadius: '12px'
                                                        }}
                                                    >
                                                        {props.gym?.verified ? 'Verified' : 'Pending Verification'}
                                                    </Badge>
                                                </div>
                                                <Button 
                                                    style={{
                                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                        color: '#111',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: '600',
                                                        padding: '10px 20px',
                                                        fontSize: '1rem',
                                                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                                                        transition: 'all 0.3s ease',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <i className="bi bi-pencil me-2"></i>
                                                    Edit Gym Information
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {/* Recent Activity */}
                                    <Col lg={6} className="mb-4">
                                        <Card 
                                            className="h-100 border-0"
                                            style={{
                                                background: '#fff',
                                                borderRadius: '18px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <Card.Header 
                                                className="border-0"
                                                style={{
                                                    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                                    color: '#fff',
                                                    borderRadius: '18px 18px 0 0',
                                                    padding: '1.5rem'
                                                }}
                                            >
                                                <h5 style={{ marginBottom: '0', fontWeight: '700', fontSize: '1.3rem' }}>
                                                    <i className="bi bi-activity me-2"></i>
                                                    Recent Activity
                                                </h5>
                                            </Card.Header>
                                            <Card.Body className="p-4">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="d-flex align-items-center mb-3">
                                                        <div 
                                                            style={{
                                                                background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                                                                borderRadius: '10px',
                                                                width: '36px',
                                                                height: '36px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginRight: '12px'
                                                            }}
                                                        >
                                                            <i className="bi bi-person" style={{ fontSize: '1rem', color: '#fff' }}></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div style={{ fontWeight: '600', color: '#111', fontSize: '0.95rem' }}>
                                                                New member joined
                                                            </div>
                                                            <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                                John Doe • 2 hours ago
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button 
                                                    variant="outline-dark"
                                                    size="sm"
                                                    className="w-100 mt-2"
                                                    style={{
                                                        borderRadius: '10px',
                                                        fontWeight: '600',
                                                        border: '2px solid #dee2e6',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    View All Activity
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            

                                {/* Quick Actions */}
                                <Row className="justify-content-center mt-4">
                                    <Col md={10}>
                                        <Card 
                                            className="border-0"
                                            style={{
                                                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                                borderRadius: '18px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <Card.Body className="p-4">
                                                <h5 style={{ fontWeight: '700', color: '#111', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                                                    <i className="bi bi-lightning me-2"></i>
                                                    Quick Actions
                                                </h5>
                                                <Row>
                                                    <Col md={4} className="mb-3">
                                                        <Button 
                                                            variant="outline-dark"
                                                            className="w-100"
                                                            style={{
                                                                borderRadius: '12px',
                                                                fontWeight: '600',
                                                                padding: '12px',
                                                                fontSize: '1rem',
                                                                border: '2px solid #dee2e6',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <i className="bi bi-person-plus me-2"></i>
                                                            Add New Member
                                                        </Button>
                                                    </Col>
                                                    <Col md={4} className="mb-3">
                                                        <Button 
                                                            variant="outline-dark"
                                                            className="w-100"
                                                            style={{
                                                                borderRadius: '12px',
                                                                fontWeight: '600',
                                                                padding: '12px',
                                                                fontSize: '1rem',
                                                                border: '2px solid #dee2e6',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <i className="bi bi-megaphone me-2"></i>
                                                            Create Announcement
                                                        </Button>
                                                    </Col>
                                                    <Col md={4} className="mb-3">
                                                        <Button 
                                                            variant="outline-dark"
                                                            className="w-100"
                                                            style={{
                                                                borderRadius: '12px',
                                                                fontWeight: '600',
                                                                padding: '12px',
                                                                fontSize: '1rem',
                                                                border: '2px solid #dee2e6',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <i className="bi bi-bar-chart me-2"></i>
                                                            View Analytics
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Recent Requests Preview */}
                                <Row className="justify-content-center mt-4">
                                    <Col md={10}>
                                        <Card 
                                            className="border-0"
                                            style={{
                                                background: '#fff',
                                                borderRadius: '18px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <Card.Header 
                                                className="border-0 d-flex justify-content-between align-items-center"
                                                style={{
                                                    background: 'linear-gradient(135deg, #111 0%, #333 100%)',
                                                    color: '#fff',
                                                    borderRadius: '18px 18px 0 0',
                                                    padding: '1.5rem'
                                                }}
                                            >
                                                <h5 style={{ marginBottom: '0', fontWeight: '700', fontSize: '1.3rem' }}>
                                                    <i className="bi bi-clock-history me-2"></i>
                                                    Recent Join Requests
                                                </h5>
                                                <Badge 
                                                    style={{
                                                        background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                                                        color: '#fff',
                                                        fontSize: '0.9rem',
                                                        padding: '6px 12px',
                                                        borderRadius: '12px'
                                                    }}
                                                >
                                                    8 Pending
                                                </Badge>
                                            </Card.Header>
                                            <Card.Body className="p-4">
                                                {(memberships?.members || []).map((memb, index) => (
                                                    <div key={memb.id} className="d-flex align-items-center justify-content-between mb-3 p-3" style={{ background: '#f8f9fa', borderRadius: '12px' }}>
                                                        <div className="d-flex align-items-center">
                                                            <div 
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                                                                    borderRadius: '10px',
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    marginRight: '12px'
                                                                }}
                                                            >
                                                                <i className="bi bi-person" style={{ fontSize: '1.2rem', color: '#fff' }}></i>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: '600', color: '#111', fontSize: '1rem' }}>
                                                                    Member Request #{index + 1}
                                                                </div>
                                                                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                                    {memb.user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <Button 
                                                                size="sm"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontWeight: '600',
                                                                    padding: '6px 12px',
                                                                    fontSize: '0.85rem',
                                                                    boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                onClick={() => handleAccept(memb)}
                                                            >
                                                                <i className="bi bi-check me-1"></i>
                                                                Accept
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    fontWeight: '600',
                                                                    padding: '6px 12px',
                                                                    fontSize: '0.85rem',
                                                                    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                onClick={() => handleReject(memb)}
                                                            >
                                                                <i className="bi bi-x me-1"></i>
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button 
                                                    style={{
                                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                                        color: '#111',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: '600',
                                                        padding: '10px 20px',
                                                        fontSize: '1rem',
                                                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                                                        transition: 'all 0.3s ease',
                                                        width: '100%'
                                                    }}
                                                    onClick={() => navigate('/all-requests')}
                                                >
                                                    <i className="bi bi-list-ul me-2"></i>
                                                    View All Requests
                                                </Button>
                                                
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            
                            </Tab>
                                


                            {/* Management Tab */}
                            <Tab 
                                eventKey="management" 
                                title={
                                    <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                        <i className="bi bi-gear me-2"></i>
                                        Management
                                    </span>
                                }
                            >
                                <Row>
                                    {/* Members Management */}
                                    <Col lg={6} className="mb-4">
                                        <Card 
                                            className="h-100 border-0"
                                            style={{
                                                background: '#fff',
                                                borderRadius: '18px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <Card.Header 
                                                className="border-0"
                                                style={{
                                                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                    color: '#fff',
                                                    borderRadius: '18px 18px 0 0',
                                                    padding: '1.5rem'
                                                }}
                                            >
                                                <h5 style={{ marginBottom: '0', fontWeight: '700', fontSize: '1.3rem' }}>
                                                    <i className="bi bi-people me-2"></i>
                                                    Members Management
                                                </h5>
                                            </Card.Header>
                                            <Card.Body className="p-4">
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span style={{ color: '#666', fontSize: '1rem' }}>Active Members</span>
                                                        <Badge 
                                                            style={{
                                                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                                color: '#fff',
                                                                fontSize: '0.9rem',
                                                                padding: '6px 12px',
                                                                borderRadius: '12px'
                                                            }}
                                                        >
                                                            142
                                                        </Badge>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span style={{ color: '#666', fontSize: '1rem' }}>Public Profiles</span>
                                                        <Badge 
                                                            style={{
                                                                background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                                                                color: '#fff',
                                                                fontSize: '0.9rem',
                                                                padding: '6px 12px',
                                                                borderRadius: '12px'
                                                            }}
                                                        >
                                                            89
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Link to={props.gym?.id ? `/gyms/${props.gym?.id}/members` : '#'} //TODO members list
											        state={{ gym: props?.gym || null }} //useLocation().state.gym
                                                >
                                                    <Button 
                                                        className="w-100 mb-2"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            fontWeight: '600',
                                                            padding: '10px 20px',
                                                            fontSize: '1rem',
                                                            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <i className="bi bi-list me-2"></i>
                                                        View All Members
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="outline-dark"
                                                    className="w-100"
                                                    style={{
                                                        borderRadius: '12px',
                                                        fontWeight: '600',
                                                        padding: '10px 20px',
                                                        fontSize: '1rem',
                                                        border: '2px solid #dee2e6',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <i className="bi bi-person-plus me-2"></i>
                                                    Add Member Manually
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {/* Posts Management */}
                                    <Col lg={6} className="mb-4">
                                        <Card 
                                            className="h-100 border-0"
                                            style={{
                                                background: '#fff',
                                                borderRadius: '18px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <Card.Header 
                                                className="border-0"
                                                style={{
                                                    background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                                                    color: '#fff',
                                                    borderRadius: '18px 18px 0 0',
                                                    padding: '1.5rem'
                                                }}
                                            >
                                                <h5 style={{ marginBottom: '0', fontWeight: '700', fontSize: '1.3rem' }}>
                                                    <i className="bi bi-chat-square-text me-2"></i>
                                                    Posts Management
                                                </h5>
                                            </Card.Header>
                                            <Card.Body className="p-4">
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span style={{ color: '#666', fontSize: '1rem' }}>Total Posts</span>
                                                        <Badge 
                                                            style={{
                                                                background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                                                                color: '#fff',
                                                                fontSize: '0.9rem',
                                                                padding: '6px 12px',
                                                                borderRadius: '12px'
                                                            }}
                                                        >
                                                            89
                                                        </Badge>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span style={{ color: '#666', fontSize: '1rem' }}>This Week</span>
                                                        <Badge 
                                                            style={{
                                                                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                                                                color: '#fff',
                                                                fontSize: '0.9rem',
                                                                padding: '6px 12px',
                                                                borderRadius: '12px'
                                                            }}
                                                        >
                                                            12
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button 
                                                    className="w-100 mb-2"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: '600',
                                                        padding: '10px 20px',
                                                        fontSize: '1rem',
                                                        boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <i className="bi bi-eye me-2"></i>
                                                    View All Posts
                                                </Button>
                                                <Button 
                                                    variant="outline-dark"
                                                    className="w-100"
                                                    style={{
                                                        borderRadius: '12px',
                                                        fontWeight: '600',
                                                        padding: '10px 20px',
                                                        fontSize: '1rem',
                                                        border: '2px solid #dee2e6',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <i className="bi bi-plus-circle me-2"></i>
                                                    Create Post
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </div>

    <style>{`
        .nav-tabs .nav-link {
            border: none !important;
            border-radius: 12px 12px 0 0 !important;
            color: #666 !important;
            font-weight: 600 !important;
            padding: 12px 24px !important;
            margin-right: 8px !important;
            background: #f8f9fa !important;
            transition: all 0.3s ease !important;
        }
        
        .nav-tabs .nav-link:hover {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
            color: #111 !important;
            transform: translateY(-2px) !important;
        }
        
        .nav-tabs .nav-link.active {
            background: linear-gradient(135deg, #111 0%, #333 100%) !important;
            color: #FFD700 !important;
            border: none !important;
        }
        
        .nav-tabs {
            border-bottom: 2px solid #f0f0f0 !important;
        }
        
        .tab-content {
            padding-top: 2rem !important;
        }
    `}</style>
    </>
    );
}