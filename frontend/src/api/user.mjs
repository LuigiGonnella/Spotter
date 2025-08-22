// Helper function per l'errore handling
import { NEXT_PUBLIC_API_URL } from "../../utils/config.mjs";
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
        case 422: // Validation errors
          errorMessage = errorData.errors?.length > 0 
            ? `${errorData.errors[0].msg} for ${errorData.errors[0].path}`
            : errorData.error || 'Validation error';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission for this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = errorData.error || 'Conflict error.';        break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
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

export async function getUserInfo() {
    const accessToken = localStorage.getItem('accessToken');

    const res = await fetch(NEXT_PUBLIC_API_URL+'/api/user/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return handleApiResponse(res);
}