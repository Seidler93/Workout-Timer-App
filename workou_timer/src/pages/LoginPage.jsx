import { auth, firestore, googleAuthProvider } from '../utils/firebase';
import { useUserContext } from '../utils/UserContext';
import { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const {user, setUser} = useUserContext()
  const navigate = useNavigate();

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
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/googlelogo.png'} /> Sign in with Google
      </button>
    );
  }
  
  // Sign out button
  function SignOutButton() {
    return <button className='btn-blue' onClick={() => auth.signOut()}>Sign Out</button>;
  }

  const checkAndCreateUser = async (userData) => {
    // Step 1: Check if the email exists in your existing email database
    const emailExists = await checkIfEmailExists(userData.email);

    if (!emailExists) {
      try {
        const newUser = await createNewUser(userData);
        setUser(newUser);
        navigate(`/home`);
      } catch (error) {
        // Handle errors during user creation
        console.error("Error creating new user:", error);
      }
    } else {
      try {
        const newUser = await fetchUserDataByEmail(userData.email);
        setUser(newUser);
        navigate(`/home`);
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
      displayName: userData.displayName
    };

    const userDoc = firestore.doc(`users/${userData.uid}`);
    const batch = firestore.batch();
    batch.set(userDoc, userInfo);
    await batch.commit();

    return userData;
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

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {user ? <SignOutButton /> : <SignInButton />}
    </main>
  );
}

  


