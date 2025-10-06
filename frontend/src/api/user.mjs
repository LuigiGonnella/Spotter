// Helper function per l'errore handling
import { VITE_API_URL } from "../../utils/config.mjs";
const handleApiResponse = async (response) => {
    if (response.ok) {
      // Controlla se la risposta ha un contenuto JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return null; // per risposte senza contenuto (204 No Content)
    }
    
    let errorMessage;
    try {
      const errorData = await response.json();
      
      switch (response.status) {
        case 400: // Validation errors
          errorMessage = errorData.errors?.length > 0 
            ? `${errorData.errors[0].msg} for ${errorData.errors[0].path}`
            : errorData.error || 'Validation error';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in.';
          break;
        case 403:
          errorMessage = errorData.error || 'Access denied. You do not have permission for this action.';
          break;
        case 404:
          errorMessage = errorData.error || 'Resource not found.';
          break;
        case 409:
          errorMessage = errorData.error || 'Conflict error.';        break;
        case 500:
          errorMessage = errorData.error ||'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = errorData.error || 'Service temporarily unavailable.';
          break;
        default:
          errorMessage = errorData.error || `Server error (${response.status})`;
      }
    } catch (e) {
      try {
        errorMessage = await response.text() || `HTTP Error ${response.status}`;
      } catch (textError) {
        errorMessage = `HTTP Error ${response.status}`;
      }
    }
    
    throw errorMessage;
};

async function ProtectedRoute(url, options = {}) {

  let res = await fetch(url, options);
  if (res.status === 401) {
    const refresh = await fetch(VITE_API_URL+'/api/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' //inviamo refresh token
    });

    if (refresh.ok) {
      const refreshData = await refresh.json();
      localStorage.setItem('accessToken', refreshData.accessToken);

  

      options.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
      ;
      res = await fetch(url, options); //riprovo stessa route
    }
    else {
      res=refresh;
      console.error("refresh error")
      localStorage.removeItem('accessToken');
    }

  }
  return handleApiResponse(res);

}

export async function getUserInfo() { //credentials: include serve solo se stiamo inviando qualcosa via cookie (sessione ecc..) oppure se vogliamo settarlo nel controller
    const accessToken = localStorage.getItem('accessToken');

    return ProtectedRoute(VITE_API_URL+'/api/user/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include' //non serve perchè non stiamo inviando refreshToken
    });
}

export async function register(data) { /*const { email, password, firstName, lastName, dateOfBirth, bio, isPublic } = req.body;*/

  if (data.has('dateOfBirth')) {
    const value = data.get('dateOfBirth');
    if (value) {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        data.set('dateOfBirth', dateObj.toISOString());
      } else {
        data.delete('dateOfBirth'); // rimuovo se non valida
      }
    } else {
      data.delete('dateOfBirth'); // rimuovo se vuota
    }
  }
  const res = await fetch(VITE_API_URL+'/api/auth/register', {
        method: 'POST',
        body: data, //non è json, ha un fle (immagine profilo) che si salva in req.file
  credentials: 'include'
    });

    /*
    1)Il form nel frontend (es. RegisterForm.jsx) raccoglie i dati dell’utente, compreso il file immagine.
  
    2) Quando l’utente invia il form, tu crei un oggetto FormData con tutti i dati e il file.

    3) Chiami handleAuth(data) passando il FormData.

    4) handleAuth chiama la funzione register(data) che fa una richiesta fetch con il FormData come body.
    5)Nel backend, la route /api/auth/register usa il middleware multer (upload.single('profileImage')).

    6)Multer estrae il file dal FormData e lo salva nella cartella uploads/, mettendo i dati del file in req.file e i dati testuali in req.body.
 */

    return handleApiResponse(res);
}

export async function registerOAuthGoogle(idToken) {
  const res = await fetch(VITE_API_URL+'/api/auth/oauth/google', {
    method: 'POST',
    body: JSON.stringify({
      'idToken': `${idToken}`
    }),
    headers: {
      'Content-Type': 'application/json' //se invio dati formato json nel body
    },
    credentials: 'include'
  })

  return handleApiResponse(res);

}

export async function logIn(email, password) {
  const res = await fetch(VITE_API_URL+'/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          'email': `${email}`,
          'password': `${password}`
        }),
        headers: {
            'Content-Type': 'application/json' //se invio dati formato json nel body
        },
  credentials: 'include' // allow browser to receive Set-Cookie from backend
    });

    return handleApiResponse(res);
}

export async function logOut() {
  const res = await fetch(VITE_API_URL+'/api/auth/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json' //se invio dati formato json nel body
        },
        credentials: 'include' //invio refreshToken da revocare
    });

    return handleApiResponse(res);
}