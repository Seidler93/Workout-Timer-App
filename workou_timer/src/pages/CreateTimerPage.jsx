import { auth, firestore, googleAuthProvider } from '../utils/firebase';
import { Link } from "react-router-dom"
import { useUserContext } from '../utils/UserContext';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ColorSelector from '../components/ColorSelect';

export default function CreateTimerPage() {
  const {setTimers, setCurrentTimer, user} = useUserContext()

  const navigate = useNavigate();

  function capitalizeFirstLetter(str) {
    // Check if the string is not empty
    if (str.length === 0) {
      return str;
    }
  
    // Capitalize the first letter and concatenate the rest of the string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const colors = ['#EAC435', '#345995', '#E40066','#03CEA4','#FB4D3D',]
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const [selectedColor, setSelectedColor] = useState(getRandomColor()); // Set Random default color

  const [timerData, setTimerData] = useState({
    id: Math.random().toString(36).substring(2), 
    name: 'Default', 
    exerciseMin: 0, 
    exerciseSec: 30,
    restMin: 0,
    restSec: 30,
    rounds: 5,
    cycles: 1,
    cycleRestMin: 0,
    cycleRestSec: 0,
    color: selectedColor, 
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert numerical input strings to numbers
    const timerToAdd = {
      id: timerData.id,
      name: capitalizeFirstLetter(timerData.name),
      exerciseMin: parseInt(timerData.exerciseMin, 10), 
      exerciseSec: parseInt(timerData.exerciseSec, 10),
      restMin: parseInt(timerData.restMin, 10),
      restSec: parseInt(timerData.restSec, 10),
      rounds: parseInt(timerData.rounds, 10),
      cycles: parseInt(timerData.cycles, 10),
      cycleRestMin: parseInt(timerData.cycleRestMin, 10),
      cycleRestSec: parseInt(timerData.cycleRestSec, 10),
      color: timerData.color
    };

    setCurrentTimer(timerToAdd)
    // Add the new timer to the existing timers using setTimers
    setTimers((prevTimers) => [...prevTimers, timerToAdd]);
    createTimer(timerToAdd)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTimerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setTimerData((prevData) => ({
      ...prevData,
      color: selectedColor,
    }));
  }, [selectedColor])

  const createTimer = async (timer) => {
    try {
      const uid = user.uid;
      const ref = firestore.collection('users').doc(uid).collection('timers'); // Use 'timers' instead of 'posts'
      
      // Use add() to create a new document in the collection
      const newTimerDocRef = await ref.add(timer);
      navigate(`/timer`);
      
      console.log('Timer added with ID: ', newTimerDocRef.id);
    } catch (error) {
      console.error('Error creating timer:', error);
      throw error;
    }
  };

  const minOptions = Array.from({ length: 99 }, (_, index) => index);
  const secOptions = Array.from({ length: 59 }, (_, index) => index);
  const roundOptions = Array.from({ length: 59 }, (_, index) => index + 1);

  return (
    <form className="new-timer px-2" onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Name</label>
        <div>
          <input
            type="text"
            id="timerName"
            name="name"
            placeholder="Name"
            // value={timerData.name}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Work</label>
        <div className=''>
          <select
            id="workMinutes"
            name="exerciseMin"
            // size={2}
            maxMenuHeight={30}

            value={timerData.exerciseMin}
            onChange={handleInputChange}
          >
            {minOptions.map((value) => (
              <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
            ))}
          </select>
          :
          <select
            id="workSeconds"
            name="exerciseSec"
            value={timerData.exerciseSec}
            onChange={handleInputChange}
          >
            {secOptions.map((value) => (
              <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
            ))}
          </select>
          {/* <Min/> */}
        </div>
      </div>

      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Rest</label>
        <div className='d-flex'>
          <select
              id="workMinutes"
              name="restMin"
              value={timerData.restMin}
              onChange={handleInputChange}
            >
              {minOptions.map((value) => (
                <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
              ))}
            </select>
            :
            <select
              id="workSeconds"
              name="restSec"
              value={timerData.restSec}
              onChange={handleInputChange}
            >
              {secOptions.map((value) => (
                <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
              ))}
            </select>
        </div>
      </div>

      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Rounds</label>
        <div>
          <select
            id="workMinutes"
            name="rounds"
            value={timerData.rounds}
            onChange={handleInputChange}
            className='max75 text-center'
          >
            {roundOptions.map((value) => (
              <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Cycles</label>
        <div>
          <select
            id="workMinutes"
            name="cycles"
            value={timerData.cycles}
            onChange={handleInputChange}
            className='max75 text-center'
          >
            {roundOptions.map((value) => (
              <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Cycle Recovery</label>
        <div>
          <select
              id="workMinutes"
              name="cycleRestMin"
              value={timerData.cycleRestMin}
              onChange={handleInputChange}
            >
              {minOptions.map((value) => (
                <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
              ))}
            </select>
            :
            <select
              id="workSeconds"
              name="cycleRestSec"
              value={timerData.cycleRestSec}
              onChange={handleInputChange}
            >
              {secOptions.map((value) => (
                <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
              ))}
            </select>
        </div>
      </div>

      <div className="d-flex justify-content-between p-2 border-me">
        <label htmlFor="timerName">Color</label>
        <div className='pe-2'>
          <ColorSelector selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>
        </div>
      </div>

      <button className='new-timer-btn' type="submit">Start Workout</button>
    </form>
  );
};
