import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import EventDetail from './components/EventDetail';

function App() {
  return (
    <Router>
     <div className="App">
      <header className="App-header">
      </header>
      <div className='App-body'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/events/:id' element={<EventDetail />} />
        </Routes>
       </div>
       <footer className='App-footer'></footer>
      </div>
    </Router>
  );
}

export default App;
