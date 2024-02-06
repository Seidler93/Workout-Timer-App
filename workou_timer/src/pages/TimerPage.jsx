import { useState, useEffect } from 'react';
import { useUserContext } from '../utils/UserContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

let countdown;

const TimerPage = () => {
  const {currentTimer, user} = useUserContext()
  const navigate = useNavigate();

  const bgStates = ['start', 'working', 'resting', 'cycle-rest']

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [message, setMessage] = useState('starting');
  const [bgState, setBgState] = useState(bgStates[0]);  
  const [timerState, setTimerState] = useState('starting')

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
      setTimerState('resting')
      setBgState(bgStates[2])
      setMessage('begin rest')
    }
  };

  const increaseRound = () => {
    if (currentRound < currentTimer.rounds) {
      setMinutes(currentTimer.exerciseMin);
      setSeconds(currentTimer.exerciseSec);
      setIsRestPhase(false);
      setTimerState('working')
      setCurrentRound((prevRound) => prevRound + 1);
      setMessage('increase round')
      setBgState(bgStates[1])
    } else if (currentCycle < currentTimer.cycles) {
      startNextCycle();
      setBgState(bgStates[3])
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
    setTimerState('cycle-rest')
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
    if (timerState === 'starting') {
      setTimerState('working')
    }
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  return (
    <div className={`timer-page-containter ${timerState}`}>
      <div className='timer'>
        {/* <p>{message}</p> */}
        <p className='text-white clock'>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
        <div className='info'>
          <p>Round <span className='ps-4'>{currentRound}/{currentTimer.rounds}</span></p>
          {currentTimer.cycles > 1 && <p>Cycle <span className='ps-4'>{currentCycle}/{currentTimer.cycles}</span></p>}
          <p className='text-white'>{`${isRestPhase ? 'REST' : 'WORK'}`}</p>
          <button onClick={handleStartPause} className='start-btn'>{isRunning ? 'Pause' : 'Start'}</button>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;