import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { firebaseApp } from './Firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import { getSessionToken } from './FirebaseFunctions';


export const AuthContext = React.createContext();


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userCode, setUserCode] = useState(undefined);
  const [loadingUser, setLoadingUser] = useState(true);

  const auth = getAuth(firebaseApp); 

  useEffect(() => {
    onAuthStateChanged(auth, (user) => { 
      setCurrentUser(user);
      if (user) {
        const email = user.email;
        const accessToken = getSessionToken();
        const headers = {
          headers: {
            email: email,
            accesstoken: accessToken,
            'Access-Control-Allow-Origin': '*'
          }
        };

        async function fetchData() {
          try {
            setLoadingUser(true);
            const { data } = await axios.get(
              `http://localhost:4000/users/${user.email}`,
              headers
            );
            setUserCode(Number(data.userType));
            setLoadingUser(false);
          } catch (e) {
            setLoadingUser(true);
            console.log(e);
          }
        }
        fetchData();
      } else {
        setLoadingUser(false);
      }
    });
  }, [auth]); 

  if (loadingUser) {
    return (
      <div className="container">
        <h1>Loading. . .</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, userCode }}>
      {children}
    </AuthContext.Provider>
  );
};
