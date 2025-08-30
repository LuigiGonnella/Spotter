import { useEffect } from "react";
import { Navigate } from "react-router";

export default function DeniedRedirect(props) {
  useEffect(() => {
    props.setMessage({ msg: 'Access denied. Please log in.', type: 'danger' });
  }, []);
  return <Navigate replace to='/auth' />;
}