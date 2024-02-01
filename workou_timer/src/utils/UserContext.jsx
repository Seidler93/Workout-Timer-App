import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext)

const UserProvider = (props) => {
  const [currentTimer, setCurrentTimer] = useState({})
  const [timers, setTimers] = useState([])
  
  return (
    <UserContext.Provider value={{ timers, setTimers, currentTimer, setCurrentTimer }} {...props} />
  );
};

export default UserProvider;
