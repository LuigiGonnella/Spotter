import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router';
import { useActionState } from 'react';
import { useState } from 'react';

function RegisterForm(props) {
  const [state, formAction, isPending] = useActionState(
    registerFunction,
    {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      bio: '',
      profileImage: '',
      isPublic: false
    }
  );

  async function registerFunction(prevState, formData) {
  const data = new FormData(); //perchè ho un'immagine
  data.append('email', formData.get('email'));
  data.append('password', formData.get('password'));
  data.append('firstName', formData.get('firstName'));
  data.append('lastName', formData.get('lastName'));
  data.append('dateOfBirth', formData.get('dateOfBirth'));
  data.append('bio', formData.get('bio'));
  data.append('isPublic', formData.get('isPublic') === 'on');
  const file = formData.get('profileImage');
  if (file && file.size > 0) {
    data.append('profileImage', file);
  }

  try {
    await props.handleAuth("register", data); // ora data è FormData
    return { success: true };
  } catch (error) {
    return { error: 'Registration failed. Please check your information and try again.' };
  }
}
  

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{backgroundColor: '#212529'}}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6} xl={5}>
          {isPending && (
            <Alert variant="warning" className="text-center fw-semibold shadow-sm mb-4">
              <i className="bi bi-hourglass-split me-2"></i>
              Creating your Spotter account...
            </Alert>
          )}
          <Card className="shadow-lg border-0" style={{backgroundColor: '#ffffff'}}>
            <Card.Header className="text-center py-4" style={{backgroundColor: '#000000', color: '#ffffff'}}>
              <div className="mb-2">
                <i className="bi bi-trophy-fill fs-1 text-warning"></i>
              </div>
              <h2 className="fw-bold mb-0">
                Join the Spotter Community
              </h2>
              <p className="mb-0 text-light opacity-75">Connect with gym bros and elevate your fitness</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Form action={formAction}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId='firstName' className='mb-3'>
                      <Form.Label className="fw-semibold text-dark">
                        <i className="bi bi-person me-2"></i>
                        First Name
                      </Form.Label>
                      <Form.Control 
                        type='text' 
                        name='firstName' 
                        required 
                        className="py-2 border-2"
                        placeholder="Your first name"
                        style={{borderColor: '#dee2e6'}}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId='lastName' className='mb-3'>
                      <Form.Label className="fw-semibold text-dark">
                        <i className="bi bi-person me-2"></i>
                        Last Name
                      </Form.Label>
                      <Form.Control 
                        type='text' 
                        name='lastName' 
                        required 
                        className="py-2 border-2"
                        placeholder="Your last name"
                        style={{borderColor: '#dee2e6'}}
                      />
                    </Form.Group>
                  </Col>
                </Row>
  );
}

                <Form.Group controlId='email' className='mb-3'>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </Form.Label>
                <Form.Group controlId='password' className='mb-3'>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control 
                    type='password' 
                    name='password' 
                    required 
                    minLength={6} 
                    className="py-2 border-2"
                    placeholder="Create a strong password (min 6 characters)"
                    style={{borderColor: '#dee2e6'}}
                  />
                </Form.Group>
                  <Form.Control 
                <Form.Group controlId='dateOfBirth' className='mb-3'>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="bi bi-calendar me-2"></i>
                    Date of Birth
                  </Form.Label>
                  <Form.Control 
                    type='date' 
                    name='dateOfBirth' 
                    required 
                    className="py-2 border-2"
                    style={{borderColor: '#dee2e6'}}
                  />
                </Form.Group>
                    type='email' 
                <Form.Group controlId='bio' className='mb-3'>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="bi bi-chat-text me-2"></i>
                    Bio (Optional)
                  </Form.Label>
                  <Form.Control 
                    as='textarea' 
                    name='bio' 
                    rows={3} 
                    className="border-2"
                    placeholder="Tell us about your fitness journey, goals, or favorite exercises..."
                    style={{borderColor: '#dee2e6'}}
                  />
                </Form.Group>
                    name='email' 
                <Form.Group controlId='profileImage' className='mb-3'>
                  <Form.Label className="fw-semibold text-dark">
                    <i className="bi bi-camera me-2"></i>
                    Profile Picture (Optional)
                  </Form.Label>
                  <Form.Control 
                    type='file' 
                    name='profileImage' 
                    accept="image/*" 
                    className="py-2 border-2"
                    style={{borderColor: '#dee2e6'}}
                  />
                </Form.Group>
                    required 
                <Form.Group controlId='isPublic' className='mb-4'>
                  <Form.Check 
                    type='checkbox' 
                    name='isPublic' 
                    className="fw-semibold"
                    label={
                      <span>
                        <i className="bi bi-globe me-2"></i>
                        Make my profile public (other gym members can find and connect with me)
                      </span>
                    }
                  />
                </Form.Group>
                    className="py-2 border-2"
                {state.error && (
                  <Alert variant="danger" className="fw-semibold">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {state.error}
                  </Alert>
                )}
                    placeholder="your.email@example.com"
                <div className="d-grid gap-3">
                  <Button 
                    type='submit' 
                    disabled={isPending} 
                    className="py-3 fw-bold fs-5"
                    style={{backgroundColor: '#000000', borderColor: '#000000'}}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create My Spotter Account
                  </Button>
                  <Link 
                    className='btn btn-outline-dark py-2 fw-semibold' 
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
                Already part of the Spotter community?
              </p>
              <Button 
                variant="warning" 
                className="fw-bold px-4 py-2"
                onClick={() => props.setAuthType("login")}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In Instead
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
                    style={{borderColor: '#dee2e6'}}
                  />
                </Form.Group>
export default RegisterForm;