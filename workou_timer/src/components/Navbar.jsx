import { Link } from "react-router-dom"
import { useUserContext } from "../utils/UserContext"
import { useEffect } from "react"
export function Navbar() {
  const {user} = useUserContext()


  return (
    <nav>
      <h2>Gym Timer</h2>
      <Link to={'/profile'}><img src={user?.photoURL} /></Link>

    </nav>
  )
}