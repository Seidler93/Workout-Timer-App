import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import TimerCard from './components/TimerCard';
import { NewTimer } from './components/NewTimer';
import Timer from './components/Timer';

function App() {
  const [currentTimer, setCurrentTimer] = useState({})

  const timers = [
    {
      id: 1, 
      name: 'EMOM', 
      exerciseMin: 0, 
      exerciseSec: 5,
      restMin: 0,
      restSec: 5,
      rounds: 2,
      cycles: 2,
      cycleRest: 60,
    },
  ]

  useEffect(() => {
    setCurrentTimer(timers[0])
  }, [])
  
  return (
    <div className="app">
      <Navbar/>
      <div className='timer-container'>
        <button className='new-timer-btn'>New Timer</button>
        {timers.map(timer => <TimerCard key={timer.id} timer={timer}/>)}
      </div>
      <NewTimer/>
      <Timer timer={currentTimer}/>
    </div>
  );
}

export default App;
