import { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import EventDetail from './components/EventDetail';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <Router>
      <div className="App">
      
        <h1 className='text-center'>ReactCalendar</h1>
        <div className='calendar-container' style={{display: 'flex', justifyContent:'center'}}>
          <Calendar onChange={setDate} value={date}/>
        </div>
        <p className='text-center'>
          <span className='bold'>SelectedDate:</span>{' '}{date.toDateString()}
        </p>
 
    </div>
    
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
