import { Link } from "react-router-dom";

export default function ProfilePage() {
  return (
    <div>
      <Link to={'/home'}>Back</Link>
      <p>settings</p>
    </div>
  )
}