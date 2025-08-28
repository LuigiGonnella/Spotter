import {Routes, Route, Navigate} from 'react-router'
import { useState, useEffect } from 'react'
import {getUserInfo, logOut, logIn, register} from './api/user.mjs';
import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DefaultLayout from '../components/DefaultLayout';
import Home from '../pages/Home'
import AuthForm from '../pages/AuthForm';
import { registerOAuthGoogle } from '../src/api/user.mjs';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState("login");


  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const user = await getUserInfo();
        
        setLoggedIn(true);
        setUser(user);
      }
      catch(err) {
        console.error('getUserInfo error:', err);

        setLoggedIn(false);
        setUser(null);
      }
      finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []); 

  const handleAuth = async (data) => {
    try {
      setLoading(true);
      let email = "";
      let password = "";
      if (authType === 'register') {
        const res = await register(data);
        if (!res || res.error) {
          throw new Error(res.error || 'Registration failed');
        }
        email = data.get('email');
        password = data.get('password');
      }
      else {
        email = data.email;
        password = data.password;
      }
      const user = await logIn(email, password);
      localStorage.setItem('accessToken', user.accessToken);
  
      setLoggedIn(true);
      setUser(user);
      authType=='register'? setMessage({msg: `Registration completed!, welcome ${user.firstName? user.firstName : user.email}`, type: "success"}) : setMessage({msg: `Login completed!, welcome ${user.firstName? user.firstName : user.email}`, type: "success"});
    } catch (error) {
      setMessage({msg:`${error}`, type:'danger'});
    }
    finally {
      setLoading(false);
    }
  };

  function GoogleLoginButton() {
  useEffect(() => {
    try {
      setLoading(true);
      /* global google */
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          // idToken restituito da Google
          const idToken = response.credential;

          const user = await registerOAuthGoogle(idToken);
          localStorage.setItem('accessToken', user.accessToken);
          setLoggedIn(true);
          setUser(user);
          setMessage({msg: `Login completed!, welcome ${user.firstName? user.firstName : user.email}`, type: "success"});

          
        },
      });

      google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      {
        theme: 'filled_black', // più in rilievo
        size: 'large',        // già il massimo, ma puoi aumentare la visibilità
        locale: 'en',
        shape: 'pill',        // bordi arrotondati
        text: 'continue_with',// testo più lungo
        width: 280            // larghezza custom
      }
    );
      
    } catch (error) {
      setMessage({msg:`${error}`, type:'danger'});
    }
    finally {
      setLoading(false);
    }
    
  }, []);

  return (
      <div
        id="googleBtn"
        style={{
          margin: '0 auto',
          marginBottom: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          borderRadius: '32px',
          maxWidth: '300px',
          background: 'transparent'
        }}
      ></div>
    );
}

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logOut();
      localStorage.removeItem('accessToken');
      setLoggedIn(false);
      setUser(null);
      setMessage({msg: `Logout completed!`, type: "info"});
      
    } catch (error) { //handleApiResponse torna già una stringa
      setMessage({msg:`${error}`, type:'danger'});
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{width: "3rem", height: "3rem"}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fs-5 text-secondary">Loading...</p>
      </div>
    </div>
    );
  }

  return (
    <Routes>
      <Route element={
        <DefaultLayout loggedIn={loggedIn} handleLogout={handleLogout} message={message} setMessage={setMessage} user={user}>
        </DefaultLayout>
      }>
      <Route path='/' element={<Home loggedIn={loggedIn} user={user}></Home>}></Route>
      <Route path='/auth' element={loggedIn ? <Navigate replace to='/'></Navigate> : <AuthForm authType={authType} setAuthType={setAuthType} handleAuth={handleAuth} googleAuth={GoogleLoginButton}></AuthForm>}></Route>
      </Route>





    </Routes>
  )
}

export default App
