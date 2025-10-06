import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';


function AuthForm(props) {
    return props.authType === "login" ?   
     <LoginForm handleAuth={props.handleAuth} setAuthType={props.setAuthType} googleAuth={props.googleAuth}></LoginForm> : <RegisterForm handleAuth={props.handleAuth} setAuthType={props.setAuthType} googleAuth={props.googleAuth} gymAuth={props.gymAuth}></RegisterForm>;
}


export default AuthForm;