import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext";
import { auth, firestore, googleAuthProvider } from '../utils/firebase';

export default function ProfilePage() {
  const {user, setUser} = useUserContext()

  // Sign out button
  function SignOutButton() {
    return <button className='btn-blue' onClick={() => auth.signOut()}>Sign Out</button>;
  }

  const minOptions = Array.from({ length: 99 }, (_, index) => index);
  const secOptions = Array.from({ length: 59 }, (_, index) => index);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Function to update user data in Firestore
  const updateUserInFirestore = async () => {
    try {
      const userRef = firestore.collection('users').doc(user.uid);
      await userRef.update({
        countdownMin: user.countdownMin,
        countdownSec: user.countdownSec,
      });
      console.log('User data updated in Firestore');
    } catch (error) {
      console.error('Error updating user data in Firestore:', error);
    }
  };

  useEffect(() => {
    // Check if the user is logged in and the user state is available
    if (user) {
      // Update user data in Firestore
      updateUserInFirestore();
    }
  }, [user])

  return (
    <div className="app">
      <div className="settings-cont d-flex flex-column justify-content-center">
        <h1 className="text-center">SETTINGS</h1>
        <div className="d-flex justify-content-between p-2 align-items-center mb-3">
          <label htmlFor="timerName">Countdown</label>
          <div className='d-flex ms-3 align-items-center'>
            <select
              id="workMinutes"
              name="countdownMin"
              maxMenuHeight={30}
              value={user.countdownMin}
              onChange={handleInputChange}
            >
              {minOptions.map((value) => (
                <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
              ))}
            </select>
            :
            <select
              id="workSeconds"
              name="countdownSec"
              value={user.countdownSec}
              onChange={handleInputChange}
            >
              {secOptions.map((value) => (
                <option key={value} value={value}>{String(value).padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>
        <SignOutButton/>
      </div>
    </div>
  )
}