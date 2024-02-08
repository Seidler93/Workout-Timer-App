import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../utils/UserContext";

export default function Beep({seconds, minutes}) {
  const {user} = useUserContext()
  const audioRef = useRef(null);
  const [beepSrc, setBeepSrc] = useState('/beep3.mp3')

  useEffect(() => {
    if (user) {
      setBeepSrc(user.beepSrc)
      // console.log(user.beepSrc);
    }
  }, [user])

  useEffect(() => {
    if (seconds === 3 && minutes === 0) {
      playSound();
      // console.log('play');
    }
  }, [seconds]);

  const playSound = () => {
    audioRef.current.play();
  };

  return  (
    <audio ref={audioRef}>
      <source src={beepSrc} type="audio/wav" />
    </audio>
  )
}
