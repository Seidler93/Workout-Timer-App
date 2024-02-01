import { useState, useEffect } from 'react';

let countdown;

const TimerPage = ({ timer }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [message, setMessage] = useState('');
  

  useEffect(() => {
    setMinutes(timer.exerciseMin);
    setSeconds(timer.exerciseSec);
  }, [timer.rounds, timer.exerciseMin, timer.exerciseSec]);

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
    } else if (currentRound === timer.rounds) {
      increaseRound()
    } else {
      setMinutes(timer.restMin);
      setSeconds(timer.restSec);
      setIsRestPhase(true);
      setMessage('begin rest')
    }
  };

  const increaseRound = () => {
    if (currentRound < timer.rounds) {
      setMinutes(timer.exerciseMin);
      setSeconds(timer.exerciseSec);
      setIsRestPhase(false);
      setCurrentRound((prevRound) => prevRound + 1);
      setMessage('increase round')
    } else if (currentCycle < timer.cycles) {
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
    setMinutes(timer.cycleRestMin);
    setSeconds(timer.cycleRestSec);
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
  }, [minutes, seconds, currentRound, currentCycle, isRunning, isRestPhase, timer]);

  const handleStartPause = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  return (
    <div>
      <p>{message}</p>
      <p>Round {currentRound}/{timer.rounds}</p>
      {timer.cycles > 1 && <p>Cycle {currentCycle}/{timer.cycles}</p>}
      <p className={`${isRestPhase ? 'rest' : 'work'}`}>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
      <p className={`${isRestPhase ? 'rest' : 'work'}`}>{`${isRestPhase ? 'rest' : 'work'}`}</p>
      <button onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
    </div>
  );
};

export default TimerPage;