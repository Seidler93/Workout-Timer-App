import { useState, useEffect } from 'react';
import { useUserContext } from '../utils/UserContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CompletedModal from '../components/CompletedModal';

let countdown;
let countdown10s;

const TimerPage = () => {
  const {currentTimer, user} = useUserContext()
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);  
  const [timerState, setTimerState] = useState('starting')
  const [rounds, setRounds] = useState([])

  // useEffect(() => {
  //   setMinutes(currentTimer.exerciseMin);
  //   setSeconds(currentTimer.exerciseSec);
  // }, [currentTimer.rounds, currentTimer.exerciseMin, currentTimer.exerciseSec]);

  useEffect(() => {
    // Create rounds array based on currentTimer object
    const newRounds = [];
    for (let i = 0; i < currentTimer.rounds; i++) {
      newRounds.push({
        workMin: currentTimer.exerciseMin,
        workSec: currentTimer.exerciseSec,
        restMin: currentTimer.restMin,
        restSec: currentTimer.restSec
      });
    }
    setRounds(newRounds);
  }, [currentTimer]);

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
    }
  };

  const increaseRound = () => {
    if (currentRound < currentTimer.rounds) {
      setMinutes(currentTimer.exerciseMin);
      setSeconds(currentTimer.exerciseSec);
      setIsRestPhase(false);
      if (timerState !== 'cycle-rest') {
        setCurrentRound((prevRound) => prevRound + 1);
      }
      setTimerState('working')
    } else if (currentCycle < currentTimer.cycles) {
      startNextCycle();
    } else {
      clearInterval(countdown);
      setIsRunning(false);
      setShowModal(true)
    }
  };

  const startNextCycle = () => {
    setCurrentCycle((prevCycle) => prevCycle + 1);
    setMinutes(currentTimer.cycleRestMin);
    setSeconds(currentTimer.cycleRestSec);
    setIsRestPhase(true);
    setCurrentRound(1);
    setTimerState('cycle-rest')
  };

  const restart = () => {
    setTimerState('starting')
    setMinutes(0)
    setSeconds(10)
    setCurrentRound(1)
    setCurrentCycle(1)
    setShowModal(false)
  }

  const previous = () => {
    if (timerState === 'starting') {
      return
    } else if (timerState === 'countdown') {
      setTimerState('starting')
      setMinutes(0)
      setSeconds(10)
    } else if (timerState === 'working' && currentRound === 1 && currentCycle === 1) {
      setTimerState('starting')
      setMinutes(0)
      setSeconds(10)
    } else if (timerState === 'working' && currentRound === 1) {
      setCurrentRound(1)
      setTimerState('cycle-rest')
      setIsRestPhase(true);
      setMinutes(currentTimer.cycleRestMin)
      setSeconds(currentTimer.cycleRestSec)
      return
    } else if (timerState === 'working' && currentRound > 1) {
      setCurrentRound((prevRound) => prevRound - 1)
      setTimerState('resting')
      setIsRestPhase(true);
      setMinutes(currentTimer.restMin)
      setSeconds(currentTimer.restSec)
      return
    } else if (timerState === 'resting') {
      setTimerState('working')
      setIsRestPhase(false);
      setMinutes(currentTimer.exerciseMin)
      setSeconds(currentTimer.exerciseSec)
      return
    } else if (timerState === 'cycle-rest') {
      setCurrentCycle((prevCycle) => prevCycle - 1)
      setCurrentRound(currentTimer.rounds)
      setTimerState('working')
      setIsRestPhase(false);
      setMinutes(currentTimer.exerciseMin)
      setSeconds(currentTimer.exerciseSec)
      return
    }
  }

  const next = () => {
    if (timerState === 'countdown' || timerState === 'starting') {
      setTimerState('working')
      setMinutes(currentTimer.exerciseMin);
      setSeconds(currentTimer.exerciseSec);
    } else {
      startRest()
    }
  }

  useEffect(() => {
    if (isRunning) {
      countdown = setInterval(() => {
        if (seconds === 0) {
          if (timerState === 'countdown') {
            setTimerState('working')
            setMinutes(currentTimer.exerciseMin);
            setSeconds(currentTimer.exerciseSec);
          } else {
            reduceMin();
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [minutes, seconds, currentRound, currentCycle, isRunning, isRestPhase, currentTimer]);

  const handleStartPause = () => {
    if (timerState === 'starting') {
      setTimerState('countdown')
    }
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  return (
    <div className={`timer-page-containter ${timerState}`}>
      <div className='timer'>
        <p className='text-white clock'>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
        <div className='info'>
          <p>Round <span className='ps-4'>{currentRound}/{currentTimer.rounds}</span></p>
          {currentTimer.cycles > 1 && <p>Cycle <span className='ps-4'>{currentCycle}/{currentTimer.cycles}</span></p>}
          <p className='text-white'>{`${isRestPhase ? 'REST' : 'WORK'}`}</p>
          <button onClick={handleStartPause} className='start-btn'>{isRunning ? 'Pause' : 'Start'}</button>
        </div>
      </div>
      <div className='timer-ls d-flex justify-content-center align-items-center'>
        <p className='text-white clock-ls'>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
        <div className='info-2-ls d-flex justify-content-around'>
          <p>Round <span className='ps-4'>{currentRound}/{currentTimer.rounds}</span></p>
          {currentTimer.cycles > 1 && <p>Cycle <span className='ps-4'>{currentCycle}/{currentTimer.cycles}</span></p>}
        </div>
        <div className='info-ls d-flex '>
          <button onClick={() => previous()}>previous</button>
          <button onClick={handleStartPause} className='start-btn-ls'>{isRunning ? 'Pause' : 'Start'}</button>
          <button onClick={() => next()}>next</button>
          <p className='text-white wf'>{`${isRestPhase ? 'REST' : 'WORK'}`}</p>
          <button onClick={() => restart()}>restart</button>
        </div>
      </div>
      <CompletedModal showModal={showModal} setShowModal={setShowModal} restart={restart}/>
    </div>
  );
};

export default TimerPage;