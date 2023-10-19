import React, { useState } from 'react';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              navigate("/home");
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
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="inputBox">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="inputBox">
            <input type="submit" value="Login" id="btn" />
          </div>
        </form>
        <div className="group">
          <a href="#">Forgot Password?</a>
          <a href="#">Sign Up</a>
        </div>
      </div>
    </section>
  );
}

export default Login;
