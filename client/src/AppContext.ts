import React, {
    createContext,
  } from "react";
  
  import { SignInFormProps } from "./screens/auth/SignInScreen";
  import { SignUpFormProps } from "./screens/auth/SignUpScreen";
  // import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
  import { Auth } from '../config/firebase';
  import { createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
  import { addNewAccountToDB, uploadImageToStorage } from "../firebase/FirestoreFunctions";
  
  export interface AuthTypes {
    isLoading: boolean;
    isSignout: boolean;
    userUuid: string | null;
  }
  
  export interface AuthContextFunctionTypes {
    signIn: (data: SignInFormProps) => Promise<string | null>;
    signOut: () => void;
    signUp: (data: SignUpFormProps) => Promise<string | null>;
    authValues: AuthTypes;
    guestSignIn: () => Promise<null>;
  }
  
  const defaultContextValue = {
    signIn: async (data: SignInFormProps) => {return null;},
    signOut: () => { return },
    signUp: async (data: SignUpFormProps) => {return null;},
    authValues: {
      isLoading: true,
      isSignout: false,
      userUuid: null
    },
    guestSignIn: async () => { return null; }
  }
  
  export enum actions {
    restoreToken = "RESTORE_TOKEN",
    signIn = "SIGN_IN",
    signOut = "SIGN_OUT",
    guestSignIn = "GUEST_SIGN_IN",
  }
  
  interface actionType {
    type: actions,
    token: string | null
  }
  
  export const AuthContext = createContext<AuthContextFunctionTypes>(defaultContextValue);
  
  export const authReducer = (prevState: AuthTypes, action: actionType) => {
    switch (action.type) {
      case "RESTORE_TOKEN":
        return {
          ...prevState,
          userUuid: action.token,
          isLoading: false,
        };
      case "SIGN_IN":
        return {
          ...prevState,
          isSignout: false,
          userUuid: action.token,
        };
      case "SIGN_OUT":
        return {
          ...prevState,
          isSignout: true,
          userUuid: null,
        };
      case "GUEST_SIGN_IN":
        return {
          ...prevState,
          userUuid: "guest"
        }
      default:
        return {
          ...prevState
        }
    }
  }
  
  export const useMemoFunction = (dispatch: any, state: any) => ({
  
    guestSignIn: async () => { 
      await signInAnonymously(Auth)
      dispatch({ type: "GUEST_SIGN_IN" });
      return null;
    },
  
    signIn: async (data: SignInFormProps) => {
      // In a production app, we need to send some data (usually username, password) to server and get a token
      // We will also need to handle errors if sign in failed
      // After getting token, we need to persist the token using `SecureStore`
      // In the example, we'll use a dummy token
      // console.log(data)
  
      try {

        const userResponse = await signInWithEmailAndPassword(Auth, data.email, data.password)
        // console.log(userResponse?.user?.metadata.creationTime)
  
  
        console.log(userResponse.user.uid, "uuid login" )
        dispatch({ type: "SIGN_IN", token: userResponse.user.uid });
      } catch (error: any) {
        console.log(error.code)
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          return "Email or Password is incorrect"
        }
        return null;
      }
  
      // THis is dev stuff comment when done
        dispatch({ type: "SIGN_IN", token: "Dev" });
  
      return null;
      
    },
    signOut: async () => {
  
      dispatch({ type: "SIGN_OUT" })
      
  
      try {
        if (await isAnonymous()) {
          const user = Auth.currentUser;
          await deleteUser(user as any)
        }
      } catch (error) {
        console.log('error', error)
      }
      
      try {
        Auth.signOut()
      } catch (error) {
        console.log(error)
      }
  
    },
  
    signUp: async (data: SignUpFormProps) => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `SecureStore`
      // In the example, we'll use a dummy token
      // console.log(data)
      try {
        const userResponse = await createUserWithEmailAndPassword(Auth, data.email, data.password)
  
        // console.log(new Date(userResponse?.user?.metadata?.creationTime))
        // add the profilePicture to storage
        const profilePhotoSrc = await uploadImageToStorage(userResponse.user.uid, data.profilePhoto)
  
        const creationDate = userResponse.user.metadata.creationTime
  
        const newUserObject = {
          username: data.userName,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber.toString(),
          dateJoined: creationDate ? new Date(creationDate).toISOString() : "",
          totalPinsCollected: 0,
          totalTradesMade: 0,
          profilePhoto: profilePhotoSrc || "",
          bio: data.bio,
          uuid: userResponse.user.uid || "",
          unopenedPinsCount: 0,
        }
        addNewAccountToDB(newUserObject)

        dispatch({ type: "SIGN_IN", token: userResponse.user.uid });
      } catch (error: any) {
        console.log(error.code)
        if (error.code === "auth/email-already-in-use" ) {
          return "This email is already associated with an account"
        }
        return null;
        
      }
  
      // THis is dev stuff comment when done
      // dispatch({ type: "SIGN_IN", token: "Dev" });
  
      return null;
  
    },
    authValues: state
  })
  
  
  export const getTokenAsync = async (dispatch: any) => {
  
    try {
        Auth.onAuthStateChanged(async(user) => {
          let userUuid = null;
          if (user) {
            userUuid = user.uid
          }
  
          // Turn this off when not in dev mode
          // ******* TODO: REMOVE THIS WHEN DONE ********
          // userUuid = "dev"
  
          // console.log(userUuid, "uuid")
          
          await dispatch({ type: "RESTORE_TOKEN", token: userUuid });
         
        });
      } catch (e) {
        console.log(e);
        
      }
  
      // Turn this off when not in dev mode
      // const userUuid = "dev";
    // const userUuid = null;
  
    // await _storeUuid(userUuid);
    
    // await dispatch({ type: "RESTORE_TOKEN", token: userUuid });
      
  };
  
  // const _storeUuid = async (uuid: string) => {
  //   try {
  //     await setItemAsync('firebaseUserUuid', uuid);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  
  export const isAnonymous = async () => {
    const user = Auth.currentUser
    return user?.isAnonymous
  }
  
  export const _getUuid = async () => {
    try {
      // const value = await getItemAsync('firebaseUserUuid');
      const uuid = Auth.currentUser?.uid
      if (uuid !== null) {
        // We have data!!
        return uuid;
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  // export const _deleteStoredUuid = async () => {
  //   await deleteItemAsync('firebaseUserUuid')
  // }
  
  
  export const resetPassword = async (email: string) => {
    try { 
      const res = await sendPasswordResetEmail(Auth, email)
      // console.log(res)
      // console.log('HERE')
    } catch (e: any) {
      console.log(e.code)
      if (e.code === "auth/invalid-email") {
        return "There is no account with that email"
      } 
      return null;
    }
   
  }