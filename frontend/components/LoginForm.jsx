import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router';
import { useActionState } from 'react';
import { useState } from 'react';

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        try {
            await props.handleAuth(data);
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Please check your credentials and try again.' };
        }
    }    
    
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #f3f3f3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ animation: 'fadeIn 1s', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', borderRadius: '24px', overflow: 'hidden', background: '#000' }}>
                <Card className="border-0" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Card.Header className="text-center py-5" style={{ background: 'transparent', color: '#fff', borderBottom: 'none' }}>
                        <div className="mb-2" style={{ animation: 'trophyBounce 1.2s infinite alternate' }}>
                            <i className="bi bi-trophy-fill fs-1 text-warning" style={{ fontSize: '2.8rem' }}></i>
                        </div>
                        <h2 className="fw-bold mb-0" style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>
                            Welcome Back to Spotter
                        </h2>
                        <p className="mb-0 text-light opacity-75" style={{ fontSize: '1.1rem' }}>Sign in to your fitness community</p>
                    </Card.Header>
                    <Card.Body style={{ background: '#fff', padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
                        <Form action={formAction}>
                            <Form.Group controlId='email' className='mb-4'>
                                <Form.Label className="fw-semibold text-dark">
                                    <i className="bi bi-envelope me-2"></i>
                                    Email Address
                                </Form.Label>
                                <Form.Control 
                                    type='email' 
                                    name='email' 
                                    required 
                                    className="py-3 border-2"
                                    placeholder="Enter your email"
                                    style={{ borderColor: '#dee2e6', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                                />
                            </Form.Group>
                            <Form.Group controlId='password' className='mb-4'>
                                <Form.Label className="fw-semibold text-dark">
                                    <i className="bi bi-lock me-2"></i>
                                    Password
                                </Form.Label>
                                <Form.Control 
                                    type='password' 
                                    name='password' 
                                    required 
                                    minLength={6} 
                                    className="py-3 border-2"
                                    placeholder="Enter your password"
                                    style={{ borderColor: '#dee2e6', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-center mt-2 mb-4 mt-5">
                                {props.googleAuth && <props.googleAuth />}
                            </div>
                            {state.error && (
                                <Alert variant="danger" className="fw-semibold">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {state.error}
                                </Alert>
                            )}
                            <div className="d-grid gap-3">
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        type='submit' 
                                        disabled={isPending} 
                                        className="py-3 fw-bold fs-5"
                                        style={{ background: 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)', color: '#000', border: 'none', borderRadius: '10px', maxWidth: '320px', width: '100%', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb700 0%, #ffd700 100%)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)'}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Sign In to Spotter
                                    </Button>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Link 
                                        className='btn btn-outline-dark py-3 fw-semibold' 
                                        to={'/'} 
                                        disabled={isPending}
                                        style={{ maxWidth: '320px', width: '100%', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    </Card.Body>
                    <Card.Footer className="text-center py-4" style={{ background: '#fff', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
                        <p className="mb-2 text-muted">
                            New to the Spotter community?
                        </p>
                        <Button 
                            variant="warning" 
                            className="fw-bold px-4 py-2"
                            style={{ borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'background 0.2s' }}
                            onClick={() => props.setAuthType("register")}
                            onMouseOver={e => e.currentTarget.style.background = '#ffb700'}
                            onMouseOut={e => e.currentTarget.style.background = ''}
                        >
                            <i className="bi bi-person-plus me-2"></i>
                            Create Your Account
                        </Button>
                    </Card.Footer>
                </Card>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes trophyBounce {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}

export default LoginForm;