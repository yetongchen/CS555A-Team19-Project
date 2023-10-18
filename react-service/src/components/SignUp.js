import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {createUser} from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import "../App.css";
import { Link } from 'react-router-dom';



function SignUp() {
const {currentUser} = useContext(AuthContext);
const [match, setMatch] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {firstName, lastName, email, password} = event.target.elements;
  

    if (password.value !== event.target.elements.confirm.value) {
      setMatch('Password fields must match!');
      return false;
    }

    try {
      await createUser(
        email.value,
        password.value,
        firstName.value,
        lastName.value,
      );
    } catch (e) {
      alert(e);
    }
  };



  if (currentUser) {
    return <Navigate to='/' />;
  }


  return (
    <section>
    <div className="container"></div>
    <div className="login">
        <h2>Sign Up</h2>
        {match && <h4 className='error'>{match}</h4>}
        <form onSubmit={handleSubmit}>
            <div className="inputBox">
                <input 
                    className='form-control' 
                    type='text' 
                    placeholder='First Name' 
                    id='firstName' 
                    required />
            </div>
            <div className="inputBox">
                <input 
                    className='form-control' 
                    type='text' 
                    placeholder='Last Name' 
                    id='lastName' 
                    required />
            </div>
            <div className="inputBox">
                <input 
                    className='form-control' 
                    type='email' 
                    placeholder='Email' 
                    id='email' 
                    required />
            </div>
            <div className="inputBox">
                <input 
                    className='form-control' 
                    type='password' 
                    placeholder='Password' 
                    id='password' 
                    required />
            </div>
            <div className="inputBox">
                <input 
                    className='form-control' 
                    type='password' 
                    placeholder='Confirm Password' 
                    id='confirm' 
                    required />
            </div>
            <div className="inputBox">
                <button className="btn btn-outline-success">Sign Up</button>
            </div>
        </form>
        <div className="group">
            <a href="#">Already have an account? </a>
            <Link to="/login">Sign In</Link>
        </div>
    </div>
</section>

  );
}

export default SignUp;
