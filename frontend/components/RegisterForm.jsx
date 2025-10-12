import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router';
import { useActionState } from 'react';
import { useState } from 'react';

function RegisterForm(props) {
  const [registerType, setRegisterType] = useState("Gym"); //stato per schermata di registrazione in caso di admin-palestra, bisogna registrare prima la palestra e poi l'admin 
  const [gym, setGym] = useState(null);

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
  const [gymState, gymAction, gymPending] = useActionState(gymFunction, {
    name:'' ,
    address:'', 
    city:'' ,
    description:'', 
    email:'' 
  });

  async function gymFunction(prevState, formData) {
    const data = {
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      description: formData.get('description'),
      email: formData.get('email')
    }
    try {
      const gym = await props.gymAuth(data); //registro palestra
      console.log('Gym received from backend:', gym);
      console.log('Gym structure:', JSON.stringify(gym, null, 2));
      setGym(gym); //metto nello stato
      setRegisterType("Admin"); //dopo palestra esce view di registrazione admin
      return {success: true};
    }
    catch(err) {
      return {error: 'Gym registration failed, try again'};
    }
  }


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
    console.log(gym);
    await props.handleAuth(data, gym); // ora data è FormData, se registerType è admin stiamo registrando un admin
    return { success: true };
  } catch (error) {
    return { error: 'Registration failed. Please check your information and try again.' };
  }
}
  

  const [showSelector, setShowSelector] = useState(false);
  const [selectedType, setSelectedType] = useState('User');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #ffffffff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '520px', position: 'relative' }}>
        {/* Selector pop-out button */}
        <div
          style={{
          position: 'absolute',
          top: '32px',
          left: '-32px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          width: 'auto',
          justifyContent: 'flex-start',
        }}
        >
          <div
            style={{
            background: showSelector ? '#fff' : '#FFD700',
            color: showSelector ? '#111' : '#fff',
            borderRadius: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            width: showSelector ? '220px' : '90px',
            height: '60px',
            transition: 'width 0.3s, border-radius 0.3s',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: showSelector ? 'space-between' : 'center',
            padding: showSelector ? '0 24px' : '0',
            fontWeight: 'bold',
            fontSize: showSelector ? '1.2rem' : '2.6rem',
            overflow: 'visible',
          }}
            onMouseEnter={() => setShowSelector(true)}
            onMouseLeave={() => setShowSelector(false)}
          >
            
            <span style={{ fontSize: '2.6rem', marginRight: showSelector ? '18px' : '0', transition: 'margin 0.3s', paddingBottom: '7px', color: '#000000' }}>&lt;</span>
            {showSelector && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  style={{
                    background: selectedType === 'User' ? '#FFD700' : '#ffffff',
                    color: selectedType === 'User' ? '#111' : '#000000ff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1.08rem',
                    marginBottom: '2px',
                  }}
                  onClick={() => setSelectedType('User')}
                >User</button>
                <button
                  style={{
                    background: selectedType === 'Gym' ? '#FFD700' : '#ffffff',
                    color: selectedType === 'Gym' ? '#111' : '#000000ff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1.08rem',
                  }}
                  onClick={() => setSelectedType('Gym')}
                >Gym</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ animation: 'fadeIn 1s', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', borderRadius: '24px', overflow: 'hidden', background: '#000' }}>
        <Card className="border-0" style={{ background: 'transparent', boxShadow: 'none' }}>
          <Card.Header className="text-center py-5" style={{ background: 'transparent', color: '#fff', borderBottom: 'none' }}>
            <div className="mb-2" style={{ animation: 'trophyBounce 1.2s infinite alternate' }}>
              <i className="bi bi-trophy-fill fs-1 text-warning" style={{ fontSize: '2.8rem' }}></i>
            </div>
            <h2 className="fw-bold mb-0" style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>
              Join the Spotter Community
            </h2>
            <p className="mb-0 text-light opacity-75" style={{ fontSize: '1.1rem' }}>Connect with gym bros and elevate your fitness</p>
          </Card.Header>
          <Card.Body style={{ background: '#fff', padding: '32px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
            <div className="d-flex justify-content-center mt-2 mb-4">
              {console.log(gym)}
              {props.googleAuth && <props.googleAuth gym_={gym}/>}
            </div>
            {selectedType==="Gym" &&  registerType==="Gym" &&
            <>
            <div style={{
              background: 'linear-gradient(90deg, #fff3cd 0%, #ffeeba 100%)',
              border: '2px solid #ffc107',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(255,193,7,0.10)'
            }}>
              <span style={{fontSize: '2.2rem', color: '#d9534f', marginRight: '8px'}}>⚠️</span>
              <span style={{fontWeight: '', color: '#d9534f', fontSize: '1rem'}}>
                Attention! If you are regestering just as an admin, select your gym's <strong>name</strong>, <strong>address</strong> and <strong>city</strong>, and go on.
              </span>
            </div>
            <Form action={gymAction}>
                  <Form.Group controlId='name' className='mb-3'>
                    <Form.Label className="fw-semibold text-dark">
                      <i className="bi bi-person me-2"></i>
                      Name
                    </Form.Label>
                    <Form.Control 
                      type='text' 
                      name='name' 
                      required 
                      className="py-2 border-2"
                      placeholder="gym name"
                      style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    />
                  </Form.Group>
                  <Form.Group controlId='address' className='mb-3'>
                    <Form.Label className="fw-semibold text-dark">
                      <i className="bi bi-person me-2"></i>
                      Address
                    </Form.Label>
                    <Form.Control 
                      type='text' 
                      name='address' 
                      required 
                      className="py-2 border-2"
                      placeholder="your address"
                      style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    />
                  </Form.Group>
              <Form.Group controlId='city' className='mb-3'>
                <Form.Label className="fw-semibold text-dark">
                  <i className="bi bi-envelope me-2"></i>
                  City
                </Form.Label>
                <Form.Control 
                  type='text' 
                  name='city' 
                  required 
                  className="py-2 border-2"
                  placeholder="your city"
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
              <Form.Group controlId='description' className='mb-3'>
                <Form.Label className="fw-semibold text-dark">
                  <i className="bi bi-lock me-2"></i>
                  Description (Optional)
                </Form.Label>
                <Form.Control 
                  type='text' 
                  name='description' 
                  className="py-2 border-2"
                  placeholder="your description"
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
              <Form.Group controlId='email' className='mb-3'>
                <Form.Label className="fw-semibold text-dark">
                  <i className="bi bi-calendar me-2"></i>
                  Email (Optional)
                </Form.Label>
                <Form.Control 
                  type='email' 
                  name='email' 
                  className="py-2 border-2"
                  placeholder='your email'
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
              {gymState.error && (
                <Alert variant="danger" className="fw-semibold">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {gymState.error}
                </Alert>
              )}
              <div className='d-flex justify-content-center'>
                  <Button 
                    type='submit' 
                    disabled={gymPending} 
                    className="py-3 fw-bold fs-5"
                    style={{ background: 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)', color: '#000', border: 'none', borderRadius: '10px', maxWidth: '320px', width: '100%', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb700 0%, #ffd700 100%)'}
                    onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)'}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Go to admin
                  </Button>
                </div>
              </Form>
              </>
              }
            {(selectedType==="User" || registerType==="Admin") &&
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
                      style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
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
                      style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId='email' className='mb-3'>
                <Form.Label className="fw-semibold text-dark">
                  <i className="bi bi-envelope me-2"></i>
                  Email Address
                </Form.Label>
                <Form.Control 
                  type='email' 
                  name='email' 
                  required 
                  className="py-2 border-2"
                  placeholder="your.email@example.com"
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
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
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
              <Form.Group controlId='dateOfBirth' className='mb-3'>
                <Form.Label className="fw-semibold text-dark">
                  <i className="bi bi-calendar me-2"></i>
                  Date of Birth (Optional)
                </Form.Label>
                <Form.Control 
                  type='date' 
                  name='dateOfBirth' 
                  className="py-2 border-2"
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
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
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
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
                  style={{ borderColor: '#ffffffff', borderRadius: '12px', fontSize: '1.08rem', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                />
              </Form.Group>
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
              {state.error && (
                <Alert variant="danger" className="fw-semibold">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {state.error}
                </Alert>
              )}
              <div className="d-grid gap-3">
                <div className='d-flex justify-content-center'>
                  <Button 
                    type='submit' 
                    disabled={isPending} 
                    className="py-3 fw-bold fs-5"
                    style={{ background: 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)', color: '#000', border: 'none', borderRadius: '10px', maxWidth: '320px', width: '100%', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffb700 0%, #ffd700 100%)'}
                    onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ffd700 0%, #ffb700 100%)'}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create My Spotter Account
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
            }
            
            
          </Card.Body>
          <Card.Footer className="text-center py-4" style={{ background: '#fff', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
            <p className="mb-2 text-muted">
              Already part of the Spotter community?
            </p>
            <Button 
              variant="warning" 
              className="fw-bold px-4 py-2"
              style={{ borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'background 0.2s' }}
              onClick={() => props.setAuthType("login")}
              onMouseOver={e => e.currentTarget.style.background = '#ffb700'}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Sign In Instead
            </Button>
          </Card.Footer>
        </Card>
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
      </div>
    </div>
  );
}

export default RegisterForm;