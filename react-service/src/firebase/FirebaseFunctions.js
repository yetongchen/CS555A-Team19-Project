import { firebaseApp } from './Firebase'; 
import axios from 'axios';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'; 


const auth = getAuth(firebaseApp); 




async function createUser(email, password, firstName, lastName) {
  await createUserWithEmailAndPassword(auth, email, password); 
  await updateProfile(auth.currentUser, { displayName: firstName + " " + lastName }); 
  const accessToken = getSessionToken();

  const formData = {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    uid: auth.currentUser.uid
  };
  await axios({
    method: 'post',
    url: 'http://localhost:4000/signup',
    data: formData,
    headers: { email: email, accesstoken: accessToken }
  }).catch(function (error) {
    console.log(error);
  });
}





async function changePassword(email, oldPassword, newPassword) {
  const credential = EmailAuthProvider.credential(email, oldPassword); 
  await auth.currentUser.reauthenticateWithCredential(credential);
  await auth.currentUser.updatePassword(newPassword);
  const accessToken = getSessionToken();

  const formData = {
    email: email,
    oldPassword: oldPassword,
    newPassword: newPassword
  };
  await axios({
    method: 'post',
    url: 'http://localhost:4000/changeUserPW',
    data: formData,
    headers: { email: email, accesstoken: accessToken }
  });
  await doSignOut();
}





async function changeUserInfo(email, firstName, lastName) {
  await updateProfile(auth.currentUser, { displayName: firstName + " " + lastName });
  const accessToken = getSessionToken();
  const formData = {
    email: email,
    firstName: firstName,
    lastName: lastName
  };
  await axios({
    method: 'post',
    url: 'http://localhost:4000/changeUserInfo',
    data: formData,
    headers: { email: email, accesstoken: accessToken }
  });
}






async function doSignInWithEmailAndPassword(email, password) {
  await signInWithEmailAndPassword(auth, email, password); 
  const accessToken = getSessionToken();
  const formData = {
    email: email,
    password: password
  };
  await axios({
    method: 'post',
    url: 'http://localhost:4000/login',
    data: formData,
    headers: { email: email, accesstoken: accessToken }
  }).catch(function (error) {
    if (error.response.data.error === "User not found") {
      axios({
        method: 'post',
        url: 'http://localhost:4000/signup',
        data: {
          email: auth.currentUser.email, firstName: auth.currentUser.displayName, lastName: "Unknown",
          password: password, uid: auth.currentUser.uid
        },
        headers: { email: email, accesstoken: accessToken }
      });
    }
  });
}





async function doSignOut() {
  await signOut(auth); 
  axios({
    method: 'get',
    url: 'http://localhost:4000/logout'
  });
}




function getSessionToken() {
  try {
    const authToken = JSON.parse(JSON.stringify(auth.currentUser)).stsTokenManager.accessToken;
    return authToken;
  } catch (e) {
    console.log("Couldn't get firebase token from current session. Please sign in again " + e);
  }
}




export {
  createUser,
  doSignInWithEmailAndPassword,
  doSignOut,
  changePassword,
  changeUserInfo,
  getSessionToken
};
