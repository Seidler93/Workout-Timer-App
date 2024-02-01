import { Link } from "react-router-dom"

export function Navbar() {
  return (
    <nav>
      <h2>Gym Timer</h2>
      <Link to={'/profile'}>Profile</Link>
    </nav>
  )
}