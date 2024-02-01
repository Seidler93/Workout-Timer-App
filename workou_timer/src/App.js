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
      exerciseSec: 7,
      restMin: 0,
      restSec: 7,
      rounds: 3,
      cycles: 3,
      cycleRestMin: 0,
      cycleRestSec: 7,
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
