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
            await props.handleAuth("login", data);
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Check your credentials.' };
        }
    }    
    
    return (
        <Row className="justify-content-center align-items-center min-vh-100"> {/*centra il form verticalmente e orizzontalmente*/}
            <Col md={6} lg={4}>
                { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }
                <Card className="border-2 border-dark">
                    <Card.Header className="text-center">
                        <h3>
                            <i className="bi bi-person-circle me-2"></i> {/*icona con persona */}
                            Login
                        </h3>
                    </Card.Header>
                    <Card.Body>
                        <Form action={formAction}> {/*dati del formi inviati alla variabile di stato*/}
                            <Form.Group controlId='email' className='mb-3'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' name='email' required /> {/*name deve essere uguale a controlId*/}
                            </Form.Group>

                            <Form.Group controlId='password' className='mb-3'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' name='password' required minLength={6} />
                            </Form.Group>

                            {state.error && <p className="text-danger">{state.error}</p>}

                            <div className="d-grid gap-2">
                                <Button type='submit' disabled={isPending} variant="primary">
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    Login
                                </Button>
                                <Link className='btn btn-outline-secondary' to={'/'} disabled={isPending}>
                                    <i className="bi bi-arrow-left me-1"></i>
                                    Annulla
                                </Link>
                            </div>
                        </Form>
                    </Card.Body>
                    <Card.Footer className="text-center text-muted">                            
                         <small>
                            you don't have an account yet? 
                        </small>
                        <Button variant="link" onClick={() => props.setAuthType("register")}>
                            Register
                        </Button>
                        
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );

}

export default LoginForm;