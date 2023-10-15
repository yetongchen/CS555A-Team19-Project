import { useState } from 'react';
import Calendar from 'react-calendar';
import './App.css'
import './Calendar.css';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="App">
      
        <h1 className='text-center'>ReactCalendar</h1>
        <div className='calendar-container' style={{display: 'flex', justifyContent:'center'}}>
          <Calendar onChange={setDate} value={date}/>
        </div>
        <p className='text-center'>
          <span className='bold'>SelectedDate:</span>{' '}{date.toDateString()}
        </p>
 
    </div>
  );
}

export default App;
