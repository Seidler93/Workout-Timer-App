import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"

export default function TimerCard({timer}) {
  const {currentTimer, setCurrentTimer} = useUserContext()
  const navigate = useNavigate();

  function handleSetTimer() {
    setCurrentTimer(timer)
    navigate(`/timer`);
  }

  return (
    <div onClick={() => handleSetTimer()} className="timer-card">
      <h2>{timer.name}</h2>
    </div>
  )
}