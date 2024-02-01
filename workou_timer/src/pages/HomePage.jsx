import { Navbar } from '../components/Navbar';
import TimerCard from '../components/TimerCard';
import { Link } from 'react-router-dom';
import { useUserContext } from '../utils/UserContext';
import { useEffect } from 'react';

export default function HomePage() {
  const {timers, setTimers} = useUserContext()

  const myTimers = [
    {
      id: 1, 
      name: 'Intervals', 
      exerciseMin: 0, 
      exerciseSec: 7,
      restMin: 0,
      restSec: 7,
      rounds: 3,
      cycles: 3,
      cycleRestMin: 0,
      cycleRestSec: 7,
    },
    {
      id: 2, 
      name: 'EMOM', 
      exerciseMin: 0, 
      exerciseSec: 5,
      restMin: 0,
      restSec: 0,
      rounds: 15,
      cycles: 0,
      cycleRestMin: 0,
      cycleRestSec: 0,
    },
  ]

 

  return (
    <div className="app">
      <Navbar/>
      <div className='timer-container'>
        <Link to={'/create'} className='new-timer-btn'>New Timer</Link>
        {timers.map(timer => <TimerCard key={timer.id} timer={timer}/>)}
      </div>
    </div>
  )
}