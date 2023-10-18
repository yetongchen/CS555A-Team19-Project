import React, { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import firebaseApp, { googleAuthProvider } from '../firebase/Firebase';
import { getAuth, signInWithPopup } from 'firebase/auth';
import googleLoginImage from '../images/google_login.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (e) {
      alert(e);
    }
  }

  const auth = getAuth(firebaseApp);

  const handleGoogleLogin = () => {
      signInWithPopup(auth, googleAuthProvider)
          .then(result => {
              // navigate("/home");
          })
          .catch(error => {
              console.error("Google Login Error：", error);
              setErrorMsg(error.message); 
          });
  }

  return (
    <section>
      <div className="container"></div>
      <div className="login">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="inputBox">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="inputBox">
            <input type="submit" value="Login" id="btn" />
          </div>
          {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <button className="google-login-button" onClick={handleGoogleLogin}>
          <img src={googleLoginImage} alt="Sign in with Google" />
                      
          </button>
        <div className="group">
          <a href="#">Forgot Password?</a>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </section>
  );
}

export default Login;
