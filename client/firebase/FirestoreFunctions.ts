import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { _getUuid } from "../src/AppContext";
import { ActiveTradeType } from "./types/ActiveTradeType";
import { UserDataType } from "./types/UserType";
import { Platform } from "react-native";

// *** Various User Functions *** //

export const addNewAccountToDB = async (newUserObject: UserDataType) => {
  try {
    // add the new user to the db
    await setDoc(doc(db, `users/${newUserObject.uuid}`), newUserObject);
  } catch (error) {
    console.log(error);
  }
};

export const checkIfUserNameExists = async (username: string) => {
  try {
    
  } catch (error) {
    console.log(error)
  }
}

export const uploadImageToStorage = async (userUuid: string, profileUri: string) => {
  try {
    profileUri = Platform.OS === 'ios' ? profileUri.replace('file://', '') : profileUri;
    // get the image blob from the local file uri
    // console.log("Here")
    const response = await fetch(profileUri);
    console.log(response, "response")
    const blob = await response.blob();
    const storageRef = ref(storage, `users/${userUuid}/profile-picture`);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl
  } catch (error) {
    console.log(error)
  }
}


// *** Various Trading Functions *** //

export const startActiveTrade = async (userData: {
  uuid: string;
  username: string;
}): Promise<{ tradeCode: string }> => {
  // Create a new trade in db
  const tradeDocData: ActiveTradeType = {
    sendUserUuid: userData.uuid,
    sendUsername: userData.username,
    receiveUserUuid: "",
    receiveUsername: "",
    sendPinUuid: "",
    receivePinUuid: "",
    sendPinSrc: "",
    receivePinSrc: "",
    senderConfirmed: false,
    receiverConfirmed: false,
    isCanceled: false,
  };
  // adds doc to DB
  const tradeDoc = await addDoc(collection(db, "active-trades"), tradeDocData);
  // listens for changes to doc

  return { tradeCode: tradeDoc.id };
};
export const deleteActiveTrade = async (tradeCode: string) => {
  // Delete trade from db
  try {
    await deleteDoc(doc(db, "active-trades", tradeCode));
  } catch (error) {
    console.error(error);
  }
};

export const updateActiveTrade = async (tradeCode: string, userData: {}) => {
  try {
    // update the active trade wit the current users information
    const tradeDoc = doc(db, "active-trades", tradeCode);
    await updateDoc(tradeDoc, userData);
  } catch (error) {
    console.error(error);
  }
};

export const cancelActiveTrade = async (tradeCode: string) => {
  try {
    // update the active trade wit the current users information
    const tradeDoc = doc(db, "active-trades", tradeCode);
    await updateDoc(tradeDoc, {
      isCanceled: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const completeTradeFirebase = async (tradeCode: string) => {
  try {
    // update the active trade wit the current users information
    const userUuid = await _getUuid();
    const tradeDoc = (
      await getDoc(doc(db, "active-trades", tradeCode))
    ).data() as ActiveTradeType;
    let formattedTradeDoc;
    if (userUuid === tradeDoc?.receiveUserUuid) {
      // swap user and receiver
      formattedTradeDoc = {
        sendUserUuid: tradeDoc.receiveUserUuid,
        sendUsername: tradeDoc.receiveUsername,
        receiveUserUuid: tradeDoc.sendUserUuid,
        receiveUsername: tradeDoc.sendUsername,
        sendPinUuid: tradeDoc.receivePinUuid,
        receivePinUuid: tradeDoc.sendPinUuid,
        sendPinSrc: tradeDoc.receivePinSrc,
        receivePinSrc: tradeDoc.sendPinSrc,
        senderConfirmed: tradeDoc.receiverConfirmed,
        receiverConfirmed: tradeDoc.senderConfirmed,
        isCanceled: tradeDoc.isCanceled,
      };
    } else {
      formattedTradeDoc = tradeDoc;
    }

    // TODO delete the active trade and add the trade to the individule user profiles ********
    return tradeDoc;
  } catch (error) {
    console.error(error);
  }
};
