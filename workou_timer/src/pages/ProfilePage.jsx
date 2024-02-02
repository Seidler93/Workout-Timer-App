import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useUserContext } from "../utils/UserContext";
import { auth, firestore, googleAuthProvider } from '../utils/firebase';

export default function ProfilePage() {
  const navigate = useNavigate();
  const {user, setUser} = useUserContext()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  })

  // Sign out button
  function SignOutButton() {
    return <button className='btn-blue' onClick={() => auth.signOut()}>Sign Out</button>;
  }

  return (
    <div>
      <Link to={'/home'}>Back</Link>
      <p>settings</p>
      <SignOutButton/>
    </div>
  )
}