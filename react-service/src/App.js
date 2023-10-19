import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './firebase/Auth';
import Login from './components/Login';
import EventDetail from './components/EventDetail';
import Header from './components/Header';
import Home from './components/Home';

function App() {
  return (
    <Router>   
     <div className="App">
      <Header/>
      <div className='App-body'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/events/:id' element={<EventDetail />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
       </div>
       <footer className='App-footer'></footer>
        </div>
      </Router>
  );
}

export default App;
