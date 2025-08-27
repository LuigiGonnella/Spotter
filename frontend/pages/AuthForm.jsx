import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router';
import { useActionState } from 'react';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';


function AuthForm(props) {
    return props.authType === "login" ?   
     <LoginForm handleAuth={props.handleAuth} setAuthType={props.setAuthType}></LoginForm> : <RegisterForm handleAuth={props.handleAuth} setAuthType={props.setAuthType}></RegisterForm>;
}


export default AuthForm;