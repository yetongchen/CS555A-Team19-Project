import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './firebase/Auth';
import Login from './components/Login';
import SignUp from './components/SignUp';


function App() {
  return (
    //<AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
          </header>
        <div className='App-body'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
       </div>
       <footer className='App-footer'></footer>
        </div>
      </Router>
    //</AuthProvider>
  );
}

export default App;
