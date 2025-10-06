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

export async function registerGym(data) {
    console.log(data);
     const res = await fetch(VITE_API_URL+'/api/auth/register/gym', {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json' //se invio dati formato json nel body
            },
           body: JSON.stringify(data), 

       });
   
       return handleApiResponse(res);
    

}

export async function registerAdmin(data) {
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
     const res = await fetch(VITE_API_URL+'/api/auth/register/admin', {
           method: 'POST',
           body: data, //non è json, ha un fle (immagine profilo) che si salva in req.file
       });
   
       return handleApiResponse(res);

}

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
  console.log('CIAOHANLDE');
  return handleApiResponse(res);

}

export async function getUserGyms(userId) {
    const accessToken = localStorage.getItem('accessToken');
    const url = VITE_API_URL+`/api/user/${userId}/my-gyms`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-type': 'application/json',
        },
        credentials: 'include'

    };

    return ProtectedRoute(url, options);
    
}

export async function findAllGyms(page = 1, pageSize = 20, data) {
    console.log(data);
    const accessToken = localStorage.getItem('accessToken');
    const queryData = encodeURIComponent(JSON.stringify(data)); //come passare oggetto come query parameter

    const url = VITE_API_URL+`/api/gyms/findAll?page=${page}&pageSize=${pageSize}&data=${queryData}`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-type': 'application/json',
        },
        credentials: 'include'
    };

    return ProtectedRoute(url, options);
}

export async function joinGym(userId, gymId) {

    const accessToken = localStorage.getItem('accessToken');

    console.log(userId+' '+gymId);

    const url = VITE_API_URL+`/api/gyms/${gymId}/join`;
    const options = {
        method: 'POST',
        body: JSON.stringify({
            'userId': userId,
        }),
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-type': 'application/json',
        },
        credentials: 'include'
    };

    return ProtectedRoute(url, options);

}

export async function getUserGymsApi(gymId, data={}) {
  const accessToken = localStorage.getItem('accessToken');

  const queryData = encodeURIComponent(JSON.stringify(data));

  const url = VITE_API_URL+`/api/gyms/${gymId}/getMemberships?data=${queryData}`
  const options = {
    method : 'GET',
    headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-type': 'application/json',
    },
    credentials: 'include'
  }

  return ProtectedRoute(url, options);
}

export async function updateGymMembershipApi(userId, gymId, data={}) {
  const accessToken = localStorage.getItem('accessToken');


  const url = VITE_API_URL+`/api/gyms/${gymId}/users/${userId}/updateMemberships`
  const options = {
    method : 'PUT',
    body : JSON.stringify({
      data
    }),
    headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-type': 'application/json',
    },
    credentials: 'include'
  }

  return ProtectedRoute(url, options);
}




export async function getGym(gymId) { 
   console.log('HEYYYYY')
    const accessToken = localStorage.getItem('accessToken');
    const url = VITE_API_URL+`/api/gyms/${gymId}`
    const options = {
      method : 'GET',
      headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json',
      },
      credentials: 'include'
    }

    return ProtectedRoute(url, options);
  
}