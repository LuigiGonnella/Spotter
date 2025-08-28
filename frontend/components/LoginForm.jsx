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
    
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: '#212529'}}>
            
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    { isPending && (
                        <Alert variant="warning" className="text-center fw-semibold shadow-sm">
                            <i className="bi bi-hourglass-split me-2"></i>
                            Connecting to Spotter...
                        </Alert> 
                    )}
                    
                    <Card className="shadow-lg border-0" style={{backgroundColor: '#ffffff'}}>
                        <Card.Header className="text-center py-4" style={{backgroundColor: '#000000', color: '#ffffff'}}>
                            <div className="mb-2">
                                <i className="bi bi-trophy-fill fs-1 text-warning"></i>
                            </div>
                            <h2 className="fw-bold mb-0">
                                Welcome Back to Spotter
                            </h2>
                            <p className="mb-0 text-light opacity-75">Sign in to your fitness community</p>
                        </Card.Header>
                        <Card.Body className="p-4">
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
                                        style={{borderColor: '#dee2e6'}}
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
                                        style={{borderColor: '#dee2e6'}}
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
                                    <Button 
                                        type='submit' 
                                        disabled={isPending} 
                                        className="py-3 fw-bold fs-5"
                                        style={{backgroundColor: '#000000', borderColor: '#000000'}}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Sign In to Spotter
                                    </Button>
                                    <Link 
                                        className='btn btn-outline-dark py-3 fw-semibold' 
                                        to={'/'} 
                                        disabled={isPending}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Home
                                    </Link>
                                </div>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-center py-4" style={{backgroundColor: '#f8f9fa'}}>                            
                            <p className="mb-2 text-muted">
                                New to the Spotter community?
                            </p>
                            <Button 
                                variant="warning" 
                                className="fw-bold px-4 py-2"
                                onClick={() => props.setAuthType("register")}
                            >
                                <i className="bi bi-person-plus me-2"></i>
                                Create Your Account
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default LoginForm;