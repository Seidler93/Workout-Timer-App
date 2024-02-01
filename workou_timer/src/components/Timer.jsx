import { useState, useEffect } from 'react';

const Timer = ({ timer }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);

  // useEffect to initialize currentRound
  useEffect(() => {
    setMinutes(timer.exerciseMin);
    setSeconds(timer.exerciseSec);
  }, [timer.rounds]);

  useEffect(() => {
    let countdown;

     if (isRunning) {
      countdown = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (isRestPhase) {
              // Rest phase is up, switch back to exercise phase
              setMinutes(timer.exerciseMin);
              setSeconds(timer.exerciseSec);
              setCurrentRound((prevRound) => prevRound + 1);
              setIsRestPhase(false);
            } else {
              // Exercise phase is up, switch to rest phase
              if (currentRound < timer.rounds) {
                setMinutes(timer.restMin);
                setSeconds(timer.restSec);
                setIsRestPhase(true);
              } else {
                clearInterval(countdown);
                setIsRunning(false);
                console.log("All rounds completed!");
              }
            }
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [minutes, seconds, currentRound, isRunning]);

  const handleStartPause = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  return (
    <div>
      <p>Round {currentRound}/{timer.rounds}</p>
      <p className={`${isRestPhase ? 'rest' : 'work'}`}>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</p>
      <p className={`${isRestPhase ? 'rest' : 'work'}`}>{`${isRestPhase ? 'rest' : 'work'}`}</p>
      <button onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
    </div>
  );
};

export default Timer;
