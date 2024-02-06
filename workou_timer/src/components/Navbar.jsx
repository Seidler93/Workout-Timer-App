import { Link } from "react-router-dom"
import { useUserContext } from "../utils/UserContext"
import { useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';

export function Navbar() {
  const {user} = useUserContext()
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current URL is not the home page
  const isNotHomePage = location.pathname !== '/';
  const isTimer = location.pathname.includes('/timer')


  return (
    <nav className={`px-5 ${isTimer && 'nav-timer'}`}>
      {isNotHomePage && <Link to="/" className='back-btn'><Icon icon='typcn:arrow-back' width="40" height="40" color="white" /></Link>}
      {!isNotHomePage && <h2>Gym Timer</h2>}
      <Link to={'/profile'}><img src={user?.photoURL} /></Link>
    </nav>
  )
}