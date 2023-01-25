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
    isCanceled: false,
  }
  // adds doc to DB
  const tradeDoc = await addDoc(collection(db, "active-trades"), tradeDocData)
  // listens for changes to doc
  
  return {tradeCode: tradeDoc.id}
}
export const deleteActiveTrade = async (tradeCode: string) => {
  // Delete trade from db
  console.log("Deleting Trading")
  await deleteDoc(doc(db, "active-trades", tradeCode))
}

export const updateActiveTrade = async (tradeCode: string, userData: {uuid: string, username: string}) => {
  try {
    // update the active trade wit the current users information
    const tradeDoc = doc(db, "active-trades", tradeCode)
    await updateDoc(tradeDoc, {
      receiveUserUuid: userData.uuid,
      receiveUsername: userData.username,
    })
  } catch (error) {
    console.error(error)
  }
}