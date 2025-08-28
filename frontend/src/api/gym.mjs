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
          errorMessage = errorData.error || 'Authentication required. Please log in.';
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