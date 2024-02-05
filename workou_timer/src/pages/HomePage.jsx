import { Navbar } from '../components/Navbar';
import TimerCard from '../components/TimerCard';
import { Link } from 'react-router-dom';
import { useUserContext } from '../utils/UserContext';
import { useEffect } from 'react';
import { firestore } from '../utils/firebase';

export default function HomePage() {
  const {user, timers, setTimers} = useUserContext()

  useEffect(() => {
    fetchTimers()
  }, [])

  const defaultTimers = [
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
      color: '#345995'
    },
    {
      id: 2, 
      name: 'EMOM', 
      exerciseMin: 0, 
      exerciseSec: 5,
      restMin: 0,
      restSec: 0,
      rounds: 15,
      cycles: 1,
      cycleRestMin: 0,
      cycleRestSec: 0,
      color: '#EAC435'
    },
  ]

  const fetchTimers = async () => {
    try {
      const uid = user.uid;

      // Reference to the 'timers' subcollection under the user's document
      const timersRef = firestore.collection('users').doc(uid).collection('timers');

      // Get all documents from the collection
      const timersSnapshot = await timersRef.get();

      // Extract data from each document
      const timersData = timersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setTimers(timersData);
    } catch (error) {
      console.error('Error fetching timers:', error);
    }
  };

  return (
    <div className="app">
      <div className='timer-container'>
        <Link to={'/create'} className='new-timer-btn'>New Timer</Link>
        {defaultTimers.map(timer => <TimerCard key={timer.id} timer={timer}/>)}
        {timers.map(timer => <TimerCard key={timer.id} timer={timer}/>)}
      </div>
    </div>
  )
}