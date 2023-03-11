// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const Auth = getAuth(app);
const db = getFirestore(app);

export interface InputProps {
  userName: string;
  pack2Count: number;
  pack4Count: number;
  pack6Count: number;
}

const loginAccount = async () => {
  await signInWithEmailAndPassword(Auth, "jnalbert879@gmail.com", "Louis16");
};

export const addUnopendPinsToAccount = async (inputData: InputProps) => {
  try {
    await loginAccount();
    // check if the user name exists
    const usersCollectionRef = collection(db, "users");
    var q = query(
      usersCollectionRef,
      where("username", "==", inputData.userName)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return "User not found check user name";
    }
    const userDocument = querySnapshot.docs[0];
    const numberOfPinsToAdd =
      inputData.pack2Count * 2 +
      inputData.pack4Count * 4 +
      inputData.pack6Count * 6;
    // update user doc with new number of pins
    await updateDoc(userDocument.ref, {
      unopenedPinsCount: increment(numberOfPinsToAdd),
    })
  } catch (error) {
    alert(error);
  }
};
