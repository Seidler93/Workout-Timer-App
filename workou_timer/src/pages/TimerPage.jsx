import { useState, useEffect } from 'react';
import { useUserContext } from '../utils/UserContext';
import { Link } from 'react-router-dom';

let countdown;

const TimerPage = () => {
  const {currentTimer} = useUserContext()

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [message, setMessage] = useState('starting');
  
  useEffect(() => {
    setMinutes(currentTimer.exerciseMin);
    setSeconds(currentTimer.exerciseSec);
  }, [currentTimer.rounds, currentTimer.exerciseMin, currentTimer.exerciseSec]);

  const reduceMin = () => {
    if (minutes === 0) {
      startRest();
    } else {
      setMinutes((prevMinutes) => prevMinutes - 1);
      setSeconds(59);
    }
  };

  const startRest = () => {
    if (isRestPhase) {
      increaseRound();
    } else if (currentRound === currentTimer.rounds) {
      increaseRound()
    } else if (currentTimer.restMin === 0 && currentTimer.restSec === 0) {
      increaseRound()
    } else {
      setMinutes(currentTimer.restMin);
      setSeconds(currentTimer.restSec);
      setIsRestPhase(true);
      setMessage('begin rest')
    }
  };

  const increaseRound = () => {
    if (currentRound < currentTimer.rounds) {
      setMinutes(currentTimer.exerciseMin);
      setSeconds(currentTimer.exerciseSec);
      setIsRestPhase(false);
      setCurrentRound((prevRound) => prevRound + 1);
      setMessage('increase round')
    } else if (currentCycle < currentTimer.cycles) {
      startNextCycle();
      setMessage('increase cycle')
    } else {
      clearInterval(countdown);
      setIsRunning(false);
      setMessage("All rounds and cycles completed!");
    }
  };

  const startNextCycle = () => {
    setCurrentCycle((prevCycle) => prevCycle + 1);
    setMinutes(currentTimer.cycleRestMin);
    setSeconds(currentTimer.cycleRestSec);
    setIsRestPhase(true);
    setCurrentRound(1);
    setMessage('start next cycle')
  };

  useEffect(() => {

    if (isRunning) {
      countdown = setInterval(() => {
        if (seconds === 0) {
          reduceMin();
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [minutes, seconds, currentRound, currentCycle, isRunning, isRestPhase, currentTimer]);

  const handleStartPause = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  return (
    <div>
      <Link to={'/'}>Back</Link>

      <p>{message}</p>
      <p>Round {currentRound}/{currentTimer.rounds}</p>
      {currentTimer.cycles > 1 && <p>Cycle {currentCycle}/{currentTimer.cycles}</p>}
      <p className={`${isRestPhase ? 'rest' : 'work'}`}>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
      <p className={`${isRestPhase ? 'rest' : 'work'}`}>{`${isRestPhase ? 'rest' : 'work'}`}</p>
      <button onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
    </div>
  );
};

export default TimerPage;