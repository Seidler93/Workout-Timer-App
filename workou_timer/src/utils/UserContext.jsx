import { createContext, useState, useContext } from 'react';
import { useUserData } from './hooks';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext)

const UserProvider = (props) => {
  const [currentTimer, setCurrentTimer] = useState({})
  const [timers, setTimers] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState(null)


  
  return (
    <UserContext.Provider value={{ username, setUsername, user, setUser, timers, setTimers, currentTimer, setCurrentTimer }} {...props} />
  );
};

export default UserProvider;
