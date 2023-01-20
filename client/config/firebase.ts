import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

import Constants from "expo-constants";

// Initialize Firebase

const firebaseConfig = {
  apiKey: Constants?.manifest?.extra?.firebaseApiKey,
  authDomain: Constants?.manifest?.extra?.firebaseAuthDomain,
  projectId: Constants?.manifest?.extra?.firebaseProjectId,
  storageBucket: Constants?.manifest?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants?.manifest?.extra?.firebaseMessagingSenderId,
  appId: Constants?.manifest?.extra?.firebaseAppId,
  measurementId: Constants?.manifest?.extra?.firebaseMeasurementId,
};

const Firebase = initializeApp(firebaseConfig);

export const FirebaseAll = Firebase;
export const Auth = getAuth(FirebaseAll);
export const db = getFirestore(FirebaseAll);
export const storage = getStorage(FirebaseAll);

export const functions = getFunctions(FirebaseAll);
// connectFunctionsEmulator(functions, "192.168.1.74", 5000)
