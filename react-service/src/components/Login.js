import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Google } from "@mui/icons-material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        if (auth.currentUser) navigate("/");
      })
      .catch((e) => alert("Either email or password is incorrect"));
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      axios
        .post("http://localhost:4000/users/register", { // Update the URL to your backend endpoint
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        })
        .then((res) => navigate("/"))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Google sign in error:", error);
      alert("Google Sign-In failed, please try again.");
    }
  }

  return (
    <section>
      <div className="container"></div>
      <div className="login">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="inputBox">
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="inputBox">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="inputBox">
            <input type="submit" value="Login" id="btn" />
          </div>
          <div className="social-signin" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px', 
          }}>
            <Google onClick={handleGoogleSignIn} />
          </div>
        </form>
        <div className="group">
          <a href="#">Forgot Password?</a>
          <a href="/register">Sign Up</a>
        </div>
      </div>
    </section>
  );
}

export default Login;

