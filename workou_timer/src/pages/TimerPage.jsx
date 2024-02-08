import { useState, useEffect } from 'react';
import { useUserContext } from '../utils/UserContext';
import CompletedModal from '../components/CompletedModal';
import { Icon } from '@iconify/react';
import useSound from 'use-sound'
import Beep from '../components/Beep';
import { playBeep } from '../utils/beep';

let countdown;

const TimerPage = () => {
  const {currentTimer, user} = useUserContext()
  const [showModal, setShowModal] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);  
  const [timerState, setTimerState] = useState('starting')
  const [message, setMessage] = useState('')
  // const [beepSrc, setBeepSrc] = useState('/beep3.mp3')
  const [play, { stop }] = useSound(user.beepSrc, {volume: 0.5});
  console.log(user.beepSrc);

  useEffect(() => {
    if (user) {
      setMinutes(user.countdownMin);
      setSeconds(user.countdownSec);
      // setBeepSrc(user.beepSrc)
      // console.log(user.beepSrc);
    }
  }, [user])

  useEffect(() => {
    if (user.beep) {
      if (seconds === 3 && minutes === 0) {
        play()
      }
    }
  }, [seconds])

  useEffect(() => {
    if (!isRunning) {
      stop();
    }
  }, [isRunning, stop]);


  useEffect(() => {
    let newMessage;

    switch (timerState) {
      case 'starting':
        newMessage = '';
        break;
      case 'countdown':
        newMessage = 'Get ready...';
        break;
      case 'working':
        newMessage = 'WORK';
        break;
      case 'resting':
        newMessage = 'REST';
        break;
      case 'cycle-rest':
        newMessage = 'REST';
        break;
      default:
        newMessage = '';
        break;
    }
    setMessage(newMessage);
  }, [timerState]);
  

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
    setMinutes(user.countdownMin);
    setSeconds(user.countdownSec);
    setCurrentRound(1)
    setCurrentCycle(1)
    setShowModal(false)
  }

  const previous = () => {
    if (timerState === 'starting') {
      return
    } else if (timerState === 'countdown') {
      setTimerState('starting')
      setMinutes(user.countdownMin);
      setSeconds(user.countdownSec);
    } else if (timerState === 'working' && currentRound === 1 && currentCycle === 1) {
      setTimerState('starting')
      setMinutes(user.countdownMin);
      setSeconds(user.countdownSec);
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
          <p className='text-white wf'>{message}</p>
          <div className='d-flex justify-content-center align-items-center pt-4'>
            <button onClick={() => previous()} className='timer-nav'><Icon icon="ooui:next-rtl" width="25" height="25"/></button>
            <button onClick={handleStartPause} className='start-btn mx-3'>{isRunning ? <Icon icon="ic:baseline-pause" width="40" height="40"/> : <Icon icon="solar:play-bold" width="40" height="40"/>}</button>
            <button onClick={() => next()} className='timer-nav'><Icon icon="ooui:next-ltr" width="25" height="25"/></button>
          </div>
          <button onClick={() => restart()} className='timer-nav mt-3'><Icon icon="codicon:debug-restart" width="25" height="25"/></button>
        </div>
      </div>
      <div className='timer-ls d-flex justify-content-center align-items-center'>
        <p className='text-white clock-ls'>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
        <div className='info-2-ls d-flex justify-content-around'>
          <p>Round <span className='ps-4'>{currentRound}/{currentTimer.rounds}</span></p>
          {currentTimer.cycles > 1 && <p>Cycle <span className='ps-4'>{currentCycle}/{currentTimer.cycles}</span></p>}
        </div>
        <div className='info-ls d-flex '>
          <div className='d-flex justify-content-center align-items-center'>
            <button onClick={() => previous()} className='timer-nav'><Icon icon="ooui:next-rtl" /></button>
            <button onClick={handleStartPause} className='start-btn-ls mx-3'>{isRunning ? <Icon icon="ic:baseline-pause" width="40" height="40"/> : <Icon icon="solar:play-bold" width="40" height="40"/>}</button>
            <button onClick={() => next()} className='timer-nav'><Icon icon="ooui:next-ltr" /></button>
          </div>
          <p className='text-white wf'>{message}</p>
          <button onClick={() => restart()} className='timer-nav'><Icon icon="codicon:debug-restart" /></button>
        </div>
      </div>
      {/* <Beep minutes={minutes} seconds={seconds}/> */}
      <CompletedModal showModal={showModal} setShowModal={setShowModal} restart={restart}/>
    </div>
  );
};

export default TimerPage;