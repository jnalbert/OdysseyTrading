import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

import Constants from "expo-constants";

// Initialize Firebase


const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

const Firebase = initializeApp(firebaseConfig);

export const FirebaseAll = Firebase;
export const Auth = getAuth(FirebaseAll);
export const db = getFirestore(FirebaseAll);
export const storage = getStorage(FirebaseAll);

export const functions = getFunctions(FirebaseAll);
// connectFunctionsEmulator(functions, "192.168.1.74", 5000)
