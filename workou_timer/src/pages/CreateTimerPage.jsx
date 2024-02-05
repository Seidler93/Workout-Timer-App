import { auth, firestore, googleAuthProvider } from '../utils/firebase';
import { Link } from "react-router-dom"
import { useUserContext } from '../utils/UserContext';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

  const getRandomColor = () => {
    const colors = ['#EAC435', '#345995', '#E40066','#03CEA4','#FB4D3D',]
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

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
    color: getRandomColor(), 
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

  return (
    <>
      <Link to="/" className='back-btn'>Back</Link>

      <form className="new-timer px-2" onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Name</label>
          <input
            type="text"
            id="timerName"
            name="name"
            placeholder="Name"
            // value={timerData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Work</label>
          <div>
            <input
              type="text"
              id="timerName"
              name="exerciseMin"
              placeholder="min"
              // value={timerData.name}
              onChange={handleInputChange}
            /> 
            :
            <input
              type="text"
              id="timerName"
              name="exerciseSec"
              placeholder="sec"
              // value={timerData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Rest</label>
          <div>
            <input
              type="text"
              id="timerName"
              name="restMin"
              placeholder="min"
              // value={timerData.name}
              onChange={handleInputChange}
            /> 
            :
            <input
              type="text"
              id="timerName"
              name="restSec"
              placeholder="sec"
              // value={timerData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Rounds</label>
            <input
              type="text"
              id="timerName"
              name="rounds"
              placeholder="sec"
              // value={timerData.name}
              onChange={handleInputChange}
            />
        </div>

        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Cycles</label>
            <input
              type="text"
              id="timerName"
              name="cycles"
              placeholder="sec"
              // value={timerData.name}
              onChange={handleInputChange}
            />
        </div>

        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Cycle Recovery</label>
          <div>
            <input
              type="text"
              id="timerName"
              name="cycleRestMin"
              placeholder="min"
              // value={timerData.name}
              onChange={handleInputChange}
            /> 
            :
            <input
              type="text"
              id="timerName"
              name="cycleRestSec"
              placeholder="sec"
              // value={timerData.name}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between p-2">
          <label htmlFor="timerName">Color</label>
          <div>
            <input
              type="text"
              id="timerName"
              name="cycleRestMin"
              placeholder="Color"
              // value={timerData.name}
              onChange={handleInputChange}
            /> 
          </div>
        </div>

        <button type="submit">Start Workout</button>
      </form>
    </>
  );
};
