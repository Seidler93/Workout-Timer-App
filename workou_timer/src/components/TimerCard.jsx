import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"

export default function TimerCard({timer}) {
  const {currentTimer, setCurrentTimer} = useUserContext()
  const navigate = useNavigate();  

  function handleSetTimer() {
    setCurrentTimer(timer)
    navigate(`/timer`);
  }

  function removeQuotes(str) {
    // Remove single or double quotes from the beginning and end of the string
    return str.replace(/^['"]|['"]$/g, '');
  }

  function formatTwoDigits(value) {
    // Ensure the value has two digits by padding with leading zeros
    return String(value).padStart(2, '0');
  }

  function calculateTotalTime(time) { 
    const totalRoundsMinTime = ((time.exerciseMin + time.restMin) * time.rounds * time.cycles) * 60
    const totalRestSeconds = (time.exerciseSec + time.restSec) * time.rounds * time.cycles
    const totalRestCycleMinTime = time.cycleRestMin * time.cycles * 60
    const totalRestCycleSeconds = time.cycleRestSec * time.cycles
    const totalTimeInSeconds = totalRoundsMinTime + totalRestSeconds + totalRestCycleMinTime + totalRestCycleSeconds
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;

    return `${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
  }

  return (
    <div onClick={() => handleSetTimer()} className="timer-card" style={{backgroundColor: removeQuotes(timer.color)}}>
      <h2>{timer.name}</h2>
      <div className="d-flex justify-content-between px-4">
        <div>
          <p>Rounds: {timer.rounds}</p>
          {/* <p>{timerLength}</p> */}
          <p>Total: {calculateTotalTime(timer)}</p>
          {timer.cycles > 1 && <p>Cycles: {timer.cycles}</p>}
        </div>
        <div>
          <p>Work: {timer.exerciseMin}:{formatTwoDigits(timer.exerciseSec)}</p>
          <p>Rest: {timer.restMin}:{formatTwoDigits(timer.exerciseSec)}</p>
        </div>
      </div>
    </div>
  )
}