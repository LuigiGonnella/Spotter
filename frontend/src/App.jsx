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
import NotFound from '../pages/NotFound';
import { registerAdmin, registerGym } from './api/gym.mjs';
import MyGyms from '../pages/MyGyms';
import { SearchGyms } from '../pages/SearchGyms';
import DeniedRedirect from '../components/DeniedRedirect';
import ProfileAdmin from '../pages/ProfileAdmin';
import ProfileUser from '../pages/ProfileUser';
import GymInfo from '../pages/GymInfo';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authType, setAuthType] = useState("login");
  const [gym, setGym] = useState(null);



  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const user = await getUserInfo();
        console.log(user);
        
        setLoggedIn(true);
        setUser(user[0]);
        setGym(user[1]);
      }
      catch(err) {
        console.error('getUserInfo error:', err);

        setLoggedIn(false);
        setUser(null);
        setGym(null);
      }
      finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []); 

  const gymAuth = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      const gym = await registerGym(data);
      gym.existed? setMessage({msg:'Successfully connected to your gym!', type: 'success'}) : setMessage({msg:'Gym successfully registered!', type: 'success'});
      return gym;
    } catch (error) {
      setMessage({msg:`${error}`, type:'danger'});
    }
    finally {
      setLoading(false);
    }
  };

  const handleAuth = async (data, gym_=null) => {
    try {
      setLoading(true);
      let email = "";
      let password = "";
      console.log("CIAOOOOO");
      console.log(gym_);
      if (gym_!=null) {
        console.log("sium");
        data.append('role', 'ADMIN');
        data.append('status_admin', 'PENDING');
        data.append('gymId', gym_.id);
      }
        let res = null;
        if (authType === 'register' || gym_ != null) {
         console.log("value"+gym_);
          res = gym_==null ? await register(data) : await registerAdmin(data);
          console.log(res);
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
        const user_loc = await logIn(email, password);
        console.log(user_loc);
        if (user_loc[0].role==='ADMIN' && gym_!=null) {
          console.log(gym_);
          setGym(gym_);
        }
        else if (user_loc[0].role === 'ADMIN') {
          setGym(user_loc[1]);
          console.log(user_loc[1]);
          console.log(user_loc[1]);
        }
        localStorage.setItem('accessToken', user_loc[0].accessToken);
    
        setLoggedIn(true);
        setUser(user_loc[0]);
        console.log(user_loc[0]);
        authType=='register'? (user_loc[0].role==='ADMIN' ?
          setMessage({msg: `Registration completed!, welcome ADMIN: ${user_loc[0].firstName? user_loc[0].firstName : user_loc[0].email}`, type:'success'}) : setMessage({msg: `Registration completed!, welcome ${user_loc[0].firstName? user_loc[0].firstName : user_loc[0].email}`, type: "success"})) : (user_loc[0].role==='ADMIN' ? setMessage({msg: `Login completed!, welcome ADMIN: ${user_loc[0].firstName? user_loc[0].firstName : user_loc[0].email}`, type: "success"}) : setMessage({msg: `Login completed!, welcome ${user_loc[0].firstName? user_loc[0].firstName : user_loc[0].email}`, type: "success"}));

      }
      
    catch (error) {
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
          setUser(user[0]);
          if (user[0].role==='ADMIN') {
          setGym(user[1]);
        }
          setMessage({msg: `Login completed!, welcome ${user[0].firstName? user[0].firstName : user[0].email}`, type: "success"});

          
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
        width: 300,           // larghezza custom
        height: 1000
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
        <div className="spinner-border text-dark" role="status" style={{width: "3rem", height: "3rem"}}>
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
        <DefaultLayout loggedIn={loggedIn} handleLogout={handleLogout} message={message} setMessage={setMessage} user={user} gym={gym}>
        </DefaultLayout>
      }>
      <Route path='/' element={<Home loggedIn={loggedIn} user={user} gym={gym}></Home>}></Route>
      <Route path='/auth' element={loggedIn ? <Navigate replace to='/'></Navigate> : <AuthForm authType={authType} setAuthType={setAuthType} handleAuth={handleAuth} googleAuth={GoogleLoginButton} gymAuth={gymAuth}></AuthForm>}></Route>
      <Route path='/my-gyms' element={
        loggedIn ? <MyGyms user={user} /> : <DeniedRedirect setMessage={setMessage} />
      } />

      <Route path='/search-gyms' element={<SearchGyms user={user} setMessage={setMessage}></SearchGyms>}></Route>

      <Route path='/gyms/:gymId/info' element={<GymInfo user={user} setMessage={setMessage}></GymInfo>}></Route>

      <Route path='/profile-admin' element={loggedIn ? <ProfileAdmin user={user} gym={gym} setMessage={setMessage} /> : <DeniedRedirect setMessage={setMessage} />}></Route>

      <Route path='/profile-user' element={loggedIn ? <ProfileUser user={user} setMessage={setMessage}></ProfileUser> : <DeniedRedirect setMessage={setMessage} />}></Route>




      </Route>
      
      <Route path='*' element={<NotFound></NotFound>}></Route>




    </Routes>
  )
}

export default App
