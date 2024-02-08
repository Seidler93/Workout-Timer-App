import { auth, firestore, googleAuthProvider } from '../utils/firebase';
import { useUserContext } from '../utils/UserContext';
import { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const {user, setUser} = useUserContext()
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign in with Google button
  function SignInButton() {
    const signInWithGoogle = async () => {
      try {
        const userCredential = await auth.signInWithPopup(googleAuthProvider);
        // You can access user data from userCredential.user
        const userData = userCredential.user;

        checkAndCreateUser(userData)
      } catch (error) {
        // Handle sign-in errors
        console.error(error);
        throw error;
      }
    };  

    return (
      <a className="icon" onClick={signInWithGoogle}>
        <i className="fa-brands fa-google-plus-g"></i>
      </a>
    );
  }

  const checkAndCreateUser = async (userData) => {
    // Step 1: Check if the email exists in your existing email database
    const emailExists = await checkIfEmailExists(userData.email);

    if (!emailExists) {
      try {
        const newUser = await createNewUser(userData);
        setUser(newUser);
        navigate(`/`);
      } catch (error) {
        // Handle errors during user creation
        console.error("Error creating new user:", error);
      }
    } else {
      try {
        const newUser = await fetchUserDataByEmail(userData.email);
        setUser(newUser);
        navigate(`/`);
      } catch (error) {
        // Handle errors during user creation
        console.error("Error creating new user:", error);
      }
    }
  };

  const checkIfEmailExists = async (email) => {
    const snapshot = await firestore.collection('users').where('email', '==', email).get();
    return !snapshot.empty;
  };

  const createNewUser = async (userData) => {
    const userInfo = {
      uid: userData.uid,
      email: userData.email,
      photoURL: userData.photoURL,
      displayName: userData.displayName,
      countdownMin: 0, // Set default countdown minutes
      countdownSec: 0, // Set default countdown seconds
      beep: true,
      beepSrc: '/beep3.mp3'
    };

    const userDoc = firestore.doc(`users/${userData.uid}`);
    const batch = firestore.batch();
    batch.set(userDoc, userInfo);
    await batch.commit();

    return userData;
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const userData = userCredential.user;

      // Update user profile with additional data
      await userData.updateProfile({
        displayName: name,
      });

      // Create user document in Firestore
      const newUser = await createNewUser(userData);

      // Set user data and navigate to home page
      setUser(newUser);
      navigate(`/`);
    } catch (error) {
      console.error("Error creating new user:", error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Sign in user with email and password
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const userData = userCredential.user;

      // Fetch user data from Firestore
      const fetchedUserData = await fetchUserDataByEmail(userData.email);

      // Set user data and navigate to home page
      setUser(fetchedUserData);
      navigate(`/`);
    } catch (error) {
      console.error("Error signing in:", error);
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


  const clear = () => {
    setName('')
    setEmail('')
    setPassword('')
    console.log(true);
    setHidden(!hidden)
  }

  return (
    <div className={`cont ${hidden && 'active'}`} id='cont'>
      <div className='form-cont sign-up'>
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <SignInButton />
          </div>
          <span>or use your email for registeration</span>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" >Sign Up</button>
        </form>
      </div>

      <div className="form-cont sign-in">
        <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <SignInButton />
            </div>
            <span>or use your email password</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* <a href="#">Forget Your Password?</a> */}
            <button >Sign In</button>
          </form>
        </div>

        <div className="toggle-cont">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button onClick={() => clear()} className='hidden' id="login">Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Welcome, Friend!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button onClick={() => clear()} className='hidden' id="register">Sign Up</button>
            </div>
          </div>
        </div>
    </div>
  );
}

  


