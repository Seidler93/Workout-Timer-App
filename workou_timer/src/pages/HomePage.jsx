import { Navbar } from '../components/Navbar';
import TimerCard from '../components/TimerCard';
import { NewTimer } from '../components/NewTimer';
import Timer from '../components/Timer';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
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
        <Link to={'/create'} className='new-timer-btn'>New Timer</Link>
        {timers.map(timer => <TimerCard key={timer.id} timer={timer}/>)}
      </div>
      <Timer timer={currentTimer}/>
    </div>
  )
}