import React from 'react';
import { Navbar } from './components/Navbar';
import TimerCard from './components/TimerCard';
import { NewTimer } from './components/NewTimer';
import Timer from './components/Timer';

function App() {
  const timers = [
    {id: 1, name: 'EMOM'},
  ]

  return (
    <div className="app">
      <Navbar/>
      <button className='new-timer-btn'>New Timer</button>
      <div className='timer-container'>
        {timers.map(timer => <TimerCard key={timer.id} timer={timer}/>)}
      </div>
      <NewTimer/>
      <Timer/>
    </div>
  );
}

export default App;
