import { Outlet } from 'react-router-dom';
import UserProvider from './utils/UserContext';
import AuthStateInitializer from './utils/hooks';

function App() {
  
  return (
    <UserProvider>
      <AuthStateInitializer/>
    </UserProvider>
  );
}

export default App;
