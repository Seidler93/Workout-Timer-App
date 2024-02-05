import { useEffect } from 'react';
import { auth, firestore } from '../utils/firebase';
import { useUserContext } from '../utils/UserContext';
import { Outlet, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { Navbar } from '../components/Navbar';

const AuthStateInitializer = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUser(user);
      } else {
        // User is signed out
        setUser(null);
      }

      // Regardless of the authentication state, navigate after processing
      navigate('/');
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts or is about to be rerendered
  }, [setUser, navigate]);

  const fetchUser = async (user) => {
    try {
      // Assuming fetchUserDataByEmail is a function that fetches user data by email
      const newUser = await fetchUserDataByEmail(user.email);
      setUser(newUser);
    } catch (error) {
      // Handle errors during user creation
      console.error('Error fetching user data:', error);
    }
  };
  
  const fetchUserDataByEmail = async (email) => {
    const snapshot = await firestore.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      return userData;
    } else {
      // Handle the case where the email exists but the user data is not found
      return null;
    }
  };

  if (user) {
    return (
      <>
        <Navbar/>
        <Outlet/>
      </>
    )
  } else {
    return <LoginPage/>
  }
};


export default AuthStateInitializer;
