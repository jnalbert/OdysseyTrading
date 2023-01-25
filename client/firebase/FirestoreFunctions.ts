import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { ActiveTradeType } from "./types/ActiveTradeType"

export const addNewAccountToDB = async () => {
  
}


// *** Various Trading Functions *** //

export const startActiveTrade = async (userData: {uuid: string, username: string}): Promise<{tradeCode: string}> => {
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
  }
  // adds doc to DB
  const tradeDoc = await addDoc(collection(db, "active-trades"), tradeDocData)
  // listens for changes to doc
  
  return {tradeCode: tradeDoc.id}
}
export const deleteActiveTrade = async (tradeCode: string) => {
  // Delete trade from db
  try {
    await deleteDoc(doc(db, "active-trades", tradeCode))
  } catch (error) {
    console.error(error)
  }
}

export const updateActiveTrade = async (tradeCode: string, userData: {}) => {
  try {
    // update the active trade wit the current users information
    const tradeDoc = doc(db, "active-trades", tradeCode)
    await updateDoc(tradeDoc, userData)
  } catch (error) {
    console.error(error)
  }
}

export const cancelActiveTrade = async (tradeCode: string) => {
  try {
    // update the active trade wit the current users information
    const tradeDoc = doc(db, "active-trades", tradeCode)
    await updateDoc(tradeDoc, {
      isCanceled: true,
    })
  } catch (error) {
    console.error(error)
  }
}