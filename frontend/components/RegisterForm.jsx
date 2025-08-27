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
    return { error: 'Registration failed. Check your credentials.' };
  }
}
  

  return (
    <Row className="justify-content-center align-items-center min-vh-100">
      <Col md={6} lg={5}>
        {isPending && <Alert variant="warning">Please, wait for the server's response...</Alert>}
        <Card className="border-2 border-dark">
          <Card.Header className="text-center">
            <h3>
              <i className="bi bi-person-circle me-2"></i>
              Register
            </h3>
          </Card.Header>
          <Card.Body>
            <Form action={formAction}>
              <Form.Group controlId='email' className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' name='email' required />
              </Form.Group>

              <Form.Group controlId='password' className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' name='password' required minLength={6} />
              </Form.Group>

              <Form.Group controlId='firstName' className='mb-3'>
                <Form.Label>First Name</Form.Label>
                <Form.Control type='text' name='firstName' required />
              </Form.Group>

              <Form.Group controlId='lastName' className='mb-3'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type='text' name='lastName' required />
              </Form.Group>

              <Form.Group controlId='dateOfBirth' className='mb-3'>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type='date' name='dateOfBirth' required />
              </Form.Group>

              <Form.Group controlId='bio' className='mb-3'>
                <Form.Label>Bio</Form.Label>
                <Form.Control as='textarea' name='bio' rows={2} />
              </Form.Group>

              <Form.Group controlId='profileImage' className='mb-3'>
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type='file' name='profileImage' accept="image/*" />
              </Form.Group>

              <Form.Group controlId='isPublic' className='mb-3'>
                <Form.Check type='checkbox' name='isPublic' label='Make profile public' />
              </Form.Group>

              {state.error && <p className="text-danger">{state.error}</p>}

              <div className="d-grid gap-2">
                <Button type='submit' disabled={isPending} variant="primary">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Register
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
              Already have an account?
            </small>
            <Button variant="link" onClick={() => props.setAuthType("login")}>
              Login
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

export default RegisterForm;