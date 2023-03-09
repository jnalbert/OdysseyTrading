import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { Auth, db, storage } from "../config/firebase";
import { _getUuid } from "../src/AppContext";
import { ActiveTradeType } from "./types/ActiveTradeType";
import { UserDataType } from "./types/UserType";
import { Platform } from "react-native";
import { deleteUser, getAuth, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { PinTypeDB, WorldTypeDB, UserOwnedPinTypeDB } from './types/PinAndWorldType';
import { WorldPinsToOpenType } from '../src/screens/main/collection/OpenPacksScreen';
import { PinsDataMyCollection, WorldsAttributesType } from "../src/screens/main/collection/MyCollectionScreen";
import { WorldNameEnum } from '../src/shared/MiscTypes';
import { PastTradeType } from './types/PastTradeType';
import { getPinsDataFromCache, setPinsDataToCache } from './CachingFunctions';

// *** Various User Functions *** //

export const addNewAccountToDB = async (newUserObject: UserDataType) => {
  try {
    // add the new user to the db
    await setDoc(doc(db, `users/${newUserObject.uuid}`), newUserObject);
  } catch (error) {
    console.log(error);
  }
};

export const getProfileDataFromDB = async (userUuid: string) => {
  try {
    // get the user data from the db
    const userDoc = await getDoc(doc(db, `users/${userUuid}`));
    return userDoc.data() as UserDataType;
  } catch (error) {
    console.log(error);
  }
}

export const deleteAccount = async (uuid: string) => { 
  const auth = getAuth();
  const user = auth.currentUser;
  deleteUser(user as any).then(() => {
    // console.log("delted")
  }).catch((error) => {
    console.log('error', error)
  });

  try {
    await deleteDoc(doc(db, "users", uuid));
  } catch (error) {
    console.log(error)
  }
}

export const changePassword = async (newPassword: string) => { 
  try {
    const currentUser = Auth.currentUser;
    // console.log(currentUser)
    await updatePassword(currentUser as any, newPassword);
    console.log("password changed")
  } catch (error: any) {
    console.log(error);
    return error.code;
  }
}


export const reauthenticateUser = async (password: string) => { 
  try {
    const currentUser = Auth.currentUser;
    // console.log('first', currentUser?.email)
    await signInWithEmailAndPassword(Auth, currentUser?.email as string, password)
  
  } catch (error: any) {
    console.log(error.code)
    if (error.code === "auth/wrong-password") {
      return "wrongPass";
     }
  }
}

export const checkIfUsernameIsUnique = async (username: string) => {
  try {
    // check through the user accounts and see if the username exists
    const usersCollection = collection(db, "users");
    const resQuery = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(resQuery);
    return querySnapshot.size <= 0;
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


export const getNumberOfPacksToOpen = async (userUuid: string) => {
  try {
    const userDoc = (await getDoc(doc(db, "users", userUuid))).data() as UserDataType;
    return userDoc?.unopenedPinsCount;
  } catch (error) {
    console.log(error);
  }
}

export const getAllPins = async () => {
  try {
    // check if pins are in cache
    const pinsFromCache = await getPinsDataFromCache();
    if (!pinsFromCache) {
      console.log("getting pins from firestore")
      // if pins are not in cache
      const pinsCollection = collection(db, "pins");
      const querySnapshot = await getDocs(pinsCollection);
      const pins: PinTypeDB[] = [];
      querySnapshot.forEach((doc) => {
        pins.push(doc.data() as PinTypeDB);
      });
      setPinsDataToCache(pins);
      return pins;
    } else {
      return pinsFromCache;
    }

  } catch (error) {
    console.log(error);
  }
}

export const getWorld = async (worldUuid: string) => {
  try {
    const worldDoc = (await getDoc(doc(db, "worlds", worldUuid))).data() as WorldTypeDB;
    return worldDoc;
  } catch (error) {
    console.log(error);
  }
}

export const addPinsToUserCollection = async (userUuid: string, pins: PinTypeDB[]) => {
  try {
    // add the pins to the users pin collection
    const userPinsCollection = collection(db, "users", userUuid, "pins");
    const pinsToAddToDB: UserOwnedPinTypeDB[] = pins.map((pin) => {
      return {
        pinUuid: pin.uuid,
        worldUuid: pin.worldUuid,
        worldName: pin.worldName,
        duplicates: 1
      }
    })
    // loop through the pinsToAddToDB and check if some of the pins have duplcate uuids and if they do update the duplicates property with
    // the amount of duplcates and delete the other duplicates
    
    const pinsToAddNoDuplicates: UserOwnedPinTypeDB[] = [];
    pinsToAddToDB.forEach((pinToAdd, index) => {
      // check if the pinToAdd is a duplicate

      const pinAlreadyInPinsToAddNoDups = pinsToAddNoDuplicates.find(pin => pin.pinUuid === pinToAdd.pinUuid)
      // if the pin exists in the pinsToAddNoDuplicates array then we know that it is a duplicate
      if (pinAlreadyInPinsToAddNoDups) {
        // update the duplicates property
        pinAlreadyInPinsToAddNoDups.duplicates += 1
      } else {
        pinsToAddNoDuplicates.push(pinToAdd)
      }
    }
    )
    // console.log(pinsToAddNoDuplicates, "pinsToAddNoDuplicates")
    // add the new pins added to the user field for pins collected
    updateDoc(doc(db, "users", userUuid), {
      totalPinsCollected: increment(pins.length),
    });
    // pins that there are duplicates of
    const pinsToRemove: UserOwnedPinTypeDB[] = [];
    // check if the user already owns the designs
    const userPinsQuerySnapshot = await getDocs(userPinsCollection);

    // user already owned pins
    const usersOwnedPinDocs = userPinsQuerySnapshot.docs.map(doc => doc.data() as UserOwnedPinTypeDB)

    const batch = writeBatch(db);

    pinsToAddNoDuplicates.forEach((pinToAdd) => {
      // const alreadyOwnedPin = doc.data() as UserOwnedPinTypeDB
      // check if the already owned pin has the same uuid as a pin in pinsToAddToDB 
      const pinThatIsOwned = usersOwnedPinDocs.find(pin => pin.pinUuid === pinToAdd.pinUuid)
      // find the amount of pins that are duplicates
      // const duplicates = pinsToAddToDB.filter(pin => pin.pinUuid === pinThatIsOwned?.pinUuid).length
      if (pinThatIsOwned) {
        // add the pin to the pinsToRemove array
        // pinsToRemove.push(pinThatIsOwned)
        // add the duplicate to the already owned pin
        const currentSelectedPinDoc = doc(userPinsCollection, pinThatIsOwned.pinUuid)
        batch.update(currentSelectedPinDoc, { duplicates: increment(pinToAdd.duplicates)})
      } else {
        // add the pin to the users pin collection
        batch.set(doc(userPinsCollection, pinToAdd.pinUuid), pinToAdd);
      }
    })
    // remove the duplicates from the pinsToAddToDB array
    // pinsToAddToDB.forEach(pin => {
    //   const index = pinsToRemove.findIndex(pinToRemove => pinToRemove.pinUuid === pin.pinUuid)
    //   if (index !== -1) {
    //     pinsToAddToDB.splice(index, 1)
    //   }
    // })
    // add the pins to the users pin collection
    // create a batch to add the pins
    // const batch = writeBatch(db);
    // pinsToAddToDB.forEach(pin => {
    //   // add a doc with id of the pin uuid
    //   batch.set(doc(userPinsCollection, pin.pinUuid), pin);
    // })
    // commit the batch
    await batch.commit();

  } catch (error) {
    console.log(error);
  }
}

export const getPacksToOpenData = async (userUuid: string) => {
  try {
    const numberToOpen = await getNumberOfPacksToOpen(userUuid) || 0
    // console.log(numberToOpen)
    // get 10% of seasonal pins and get the rest split between deep sea and forest
    const countOfEachWorld: { [key: string]: number; } = {"Seasonal": Math.floor((numberToOpen * 0.1) + 1), "Enchanted Forest": Math.floor((numberToOpen * 0.45) + 1), "Deep Sea": Math.floor((numberToOpen * 0.45) + 1)}
    console.log(countOfEachWorld)
    const allPins = await getAllPins()
    if (!allPins) return
    let worldsWithPins: WorldPinsToOpenType[] = []
    for (const world in countOfEachWorld) {
      const filteredWorldDBPins = allPins.filter((pin: any) => pin.worldName === world)
      const pinsToOpen: PinTypeDB[] = []
      for (let i = 0; i < countOfEachWorld[world]; i++) {
        const randomPin = filteredWorldDBPins.sort(() => Math.random() - 0.5)[0]
        pinsToOpen.push(randomPin)
      }
      // console.log("here")
      const currentWorldData = await getWorld(pinsToOpen[0].worldUuid)
      if (!currentWorldData) return
      const worldDataToAdd = {
        world: currentWorldData?.worldName,
        color: currentWorldData?.worldColor,
        worldIcon: currentWorldData?.worldIcon,
        pickedPins: pinsToOpen
      }
      worldsWithPins.push(worldDataToAdd)
    }
    // set unopened pins count to 0
    await updateDoc(doc(db, "users", userUuid), {
      unopenedPinsCount: 0,
    });
    
    return worldsWithPins

  } catch (error) {
    console.log(error)
  }
}

export const getPinsForUserCollection = async (userUuid: string) => {
  try {
      // get all the pins from the users collection
      const userPinsCollection = collection(db, "users", userUuid, "pins");
      const querySnapshot = await getDocs(userPinsCollection);
      const userPins: UserOwnedPinTypeDB[] = [];
      querySnapshot.forEach((doc) => {
        userPins.push(doc.data() as UserOwnedPinTypeDB);
      })
      // get all of the existing pins
      const allPins = await getAllPins()
      if (!allPins) return
      // go through all pins and check it against the users pins to see if they own it 
      const pinsWithUserOwnedData = allPins.map((pin: any) => {
        const userPin = userPins.find(userPin => userPin.pinUuid === pin.uuid)
        if (userPin) {
          return {...pin, isOwned: true, duplicates: userPin.duplicates}
        } else {
          return {...pin, isOwned: false, duplicates: 1}
        }
      })
      // get all the worlds attributes
      // const worldsAttributesCollection = collection(db, "worlds");
      // const querySnapshotWorld = await getDocs(worldsAttributesCollection);
      // const worldsAttributes: WorldTypeDB[] = [];
      // querySnapshotWorld.forEach((doc) => {
      //   worldsAttributes.push(doc.data() as WorldTypeDB);
      // })

      // const pinsWithWorldsFormatted: PinsDataMyCollection = {}
      // // format the pins into an object with the worlds as the keys
      // worldsAttributes.forEach(world => {
      //   // find the pins in the current world
      //   const pinsInWorld = pinsWithUserOwnedData.filter(pin => pin.worldUuid === world.uuid)
      //   // add the pins to the object
      //   const worldAttributesKey: WorldNameEnum = switchCaseToGetWorld(world.worldName)
      //   pinsWithWorldsFormatted[worldAttributesKey] = pinsInWorld
      // })
      return pinsWithUserOwnedData
  } catch (error) {

  }
}

export const getWorldsAttributesMyCollection = async (userUuid: string) => {
  try {
      // get all the worlds attributes
      const worldsAttributesCollection = collection(db, "worlds");
      const querySnapshot = await getDocs(worldsAttributesCollection);
      const worldsAttributes: WorldTypeDB[] = [];
      querySnapshot.forEach((doc) => {
        worldsAttributes.push(doc.data() as WorldTypeDB);
      })
      // get all the pins from the users collection
      const userPinsCollection = collection(db, "users", userUuid, "pins");
      const userPinsQuerySnapshot = await getDocs(userPinsCollection);
      const userPins: UserOwnedPinTypeDB[] = [];
      userPinsQuerySnapshot.forEach((doc) => {
        userPins.push(doc.data() as UserOwnedPinTypeDB);
      })
      // find the number of each pin in the world that exists in the users collection
      const worldsAttributesWithPins: WorldsAttributesType = {}
      worldsAttributes.forEach(world => {
        const pinsInCurrentWorld = userPins.filter(pin => pin.worldUuid === world.uuid)
  //       worldName: string;
        // worldColor: string;
        // worldIcon: string;
        // numPinsInWorld: number;
        // numPinsCollected: number;
        const worldToAdd = {
          worldName: world.worldName,
          worldColor: world.worldColor,
          worldIcon: world.worldIcon,
          numPinsInWorld: world.numPinsInWorld,
          numPinsCollected: pinsInCurrentWorld.length
        }
        const worldAttributesKey: WorldNameEnum = switchCaseToGetWorld(world.worldName)
        worldsAttributesWithPins[worldAttributesKey] = worldToAdd
      })
      return worldsAttributesWithPins
  } catch (error) {
      console.log(error)
  }
}

const switchCaseToGetWorld = (world: string) => {
  switch (world) {
    case "Enchanted Forest":
      return WorldNameEnum.ENCHANTED_FOREST
    case "Deep Sea":
      return WorldNameEnum.DEEP_SEA
    case "Seasonal":
      return WorldNameEnum.SEASONAL
    default:
      return WorldNameEnum.COMING_SOON
  }
}

export const constGetPinsForTrading = async (userUuid: string) => {
  try {
    // get the user pins
    const userPinsCollection = collection(db, "users", userUuid, "pins");
      const querySnapshot = await getDocs(userPinsCollection);
      const userPins: UserOwnedPinTypeDB[] = [];
      querySnapshot.forEach((doc) => {
        userPins.push(doc.data() as UserOwnedPinTypeDB);
      })

    const allPins = await getAllPins()
    if (!allPins) return
      // find the pins in all pins that equal a userPin
    const pinsToReturn: PinTypeDB[] = []
    // find the allPins and userPinsCollection that match
    // for (let pin in userPinsCollection) {
    //   const pinInAllPins = allPins.find(pinInAllPins => pinInAllPins.uuid === pin.pinUuid)
    // }
    // go through all pins and check it against the users pins to see if they own it
    allPins.forEach((pin: any) => {
      const userPin = userPins.find(userPin => userPin.pinUuid === pin.uuid)
      if (userPin) {
        pinsToReturn.push(pin)
      }
    })
    return pinsToReturn
      
  } catch (error) {
    console.log(error)
  }
}

export const getAllWorldsForTrading = async () => {
  try {
      const allWorldsToReturns = await collection(db, "worlds");
      const querySnapshot = await getDocs(allWorldsToReturns);
      const worldsAttributes: WorldTypeDB[] = [];
      querySnapshot.forEach((doc) => {
        worldsAttributes.push(doc.data() as WorldTypeDB);
      })
      return worldsAttributes
  } catch (error) {
    console.log(error)
  }
}

export const deletePinFromUser = async (userUuid: string, pinUuid: string) => {
  try {
    // find the pin with the pinUuid in the users pins
    // console.log("deletePinFromUser", userUuid, pinUuid)
    updateDoc(doc(db, "users", userUuid), {
      totalPinsCollected: increment(-1),
    });
    const userPinsCollection = collection(db, "users", userUuid, "pins");
    // const findPinDoc = await query(userPinsCollection, where("pinUuid", "==", pinUuid))
    const pinDoc = await doc(userPinsCollection, pinUuid)
    const findPinDocSnapshot = await getDoc(pinDoc)
    const pinToDelete = findPinDocSnapshot
    const currentPinData = pinToDelete.data() as UserOwnedPinTypeDB
    if (currentPinData.duplicates > 1) {
      // update the pin to have one less duplicate
      await updateDoc(pinDoc, {duplicates: currentPinData.duplicates - 1})
    } else {
      // delete the pin
      await deleteDoc(pinDoc)
    }
    // update the total pins the person has
   

  } catch (error) {
    console.log(error)
  }
}

export const FinishTrading = async (tradeData: ActiveTradeType, currentUserUuid: string) => {
  try {

    if (tradeData.sendUserUuid === currentUserUuid) {
      // delete the sending Pin from the currentUsersCollection
      await deletePinFromUser(currentUserUuid, tradeData.sendPinUuid)
      // get the full Data pin from the database
      const docFullPin = doc(db, `pins/${tradeData.receivePinUuid}`)
      const fullPin = (await getDoc(docFullPin)).data() as PinTypeDB
      await addPinsToUserCollection(currentUserUuid, [fullPin])
    } else {
      await deletePinFromUser(currentUserUuid, tradeData.receivePinUuid)
      // get the full Data pin from the database
      const docFullPin = doc(db, `pins/${tradeData.sendPinUuid}`)
      const fullPin = (await getDoc(docFullPin)).data() as PinTypeDB
      await addPinsToUserCollection(currentUserUuid, [fullPin])
    }
  } catch (error) {
    console.log(error)
  }
}

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

    addCompetedTradesToUsers(formattedTradeDoc, userUuid || "");

    // update the users number of trades
    updateDoc(doc(db, `users/${userUuid}`), {
      totalTradesMade: increment(1),
    })

    // console.log("Formattred Trade Doc", formattedTradeDoc, "comprred fie");
    // TODO delete the active trade and add the trade to the individule user profiles ********
    return formattedTradeDoc;
  } catch (error) {
    console.error(error);
  }
};

export const addCompetedTradesToUsers = async (tradeData: ActiveTradeType, userUuid: string) => {
  try {
    //  TODODO CHANGE THIS
    // Check if the send user UUId equals the current ID and then make the past trade dont do it for both
    const date = new Date().toString()
    const sendProfilePhoto = (await getProfileDataFromDB(tradeData.sendUserUuid))?.profilePhoto || ""
    const receiveProfilePhoto = (await getProfileDataFromDB(tradeData.receiveUserUuid))?.profilePhoto || ""

    // add the trade to the senders completed trades
    const pastTradeDoc = doc(collection(db, "users", userUuid, "past-trades"))
    let pastTradeDataFormatted: PastTradeType

    if (userUuid === tradeData.sendUserUuid) {
      pastTradeDataFormatted = {
        tradeUuid: pastTradeDoc.id,
        sendUserUuid: tradeData.sendUserUuid,
        sendUsername: tradeData.sendUsername,
        sendUserPhoto: sendProfilePhoto,
        receiveUserUuid: tradeData.receiveUserUuid,
        receiveUsername: tradeData.receiveUsername,
        receiveUserPhoto: receiveProfilePhoto,
        sendPinUuid: tradeData.sendPinUuid,
        sendPinSrc: tradeData.sendPinSrc,
        receivePinUuid: tradeData.receivePinUuid,
        receivePinSrc: tradeData.receivePinSrc,
        date: date,
      }
    } else {
      pastTradeDataFormatted = {
        tradeUuid: pastTradeDoc.id,
        sendUserUuid: tradeData.receiveUserUuid,
        sendUsername: tradeData.receiveUsername,
        sendUserPhoto: receiveProfilePhoto,
        receiveUserUuid: tradeData.sendUserUuid,
        receiveUsername: tradeData.sendUsername,
        receiveUserPhoto: sendProfilePhoto,
        sendPinUuid: tradeData.receivePinUuid,
        sendPinSrc: tradeData.receivePinSrc,
        receivePinUuid: tradeData.sendPinUuid,
        receivePinSrc: tradeData.sendPinSrc,
        date: date,
      }
    }
    
    await setDoc(pastTradeDoc, pastTradeDataFormatted)
    
  } catch (error) {
    console.log(error)
  }
}

export const getPastTradesFromDB = async (userUuid: string) => {
  try {
    const pastTradesCollection = collection(db, "users", userUuid, "past-trades")
    const querySnapshot = await getDocs(pastTradesCollection)
    const pastTrades: PastTradeType[] = []
    querySnapshot.forEach((doc) => {
      pastTrades.push(doc.data() as PastTradeType)
    })
    // console.log(pastTrades)
    return pastTrades
  } catch (error) {
    console.log(error)
  }
}

export const updatePastTradeWithUserPhoto = async (tradeUuid: string) => {
  try {
    const userUuid = (await _getUuid()) || ""
    const getUserPhoto = (await getProfileDataFromDB(userUuid))?.profilePhoto || ""
    const docRef = doc(db, "users", userUuid, "past-trades", tradeUuid)
    await updateDoc(docRef, {
      sendUserPhoto: getUserPhoto,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getAllPinSrcs = async () => {
  try {
    const generalInfoDoc = (await getDoc(doc(db, "worlds", "1GeneralThings"))).data()
    return generalInfoDoc?.allPinSrcs
  } catch (error) {
    console.log(error)
  }
}