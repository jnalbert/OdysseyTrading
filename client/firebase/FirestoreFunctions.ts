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
    const pinsCollection = collection(db, "pins");
    const querySnapshot = await getDocs(pinsCollection);
    const pins: PinTypeDB[] = [];
    querySnapshot.forEach((doc) => {
      pins.push(doc.data() as PinTypeDB);
    });
    return pins;
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
    // add the new pins added to the user field for pins collected
    updateDoc(doc(db, "users", userUuid), {
      totalPinsCollected: increment(pins.length),
    });
    // pins that there are duplicates of
    const pinsToRemove: UserOwnedPinTypeDB[] = [];
    // check if the user already owns the designs
    const userPinsQuerySnapshot = await getDocs(userPinsCollection);

    userPinsQuerySnapshot.forEach((doc) => {
      const alreadyOwnedPin = doc.data() as UserOwnedPinTypeDB
      // check if the already owned pin has the same uuid as a pin in pinsToAddToDB 
      const pinsAlreadyOwned = pinsToAddToDB.find(pin => pin.pinUuid === alreadyOwnedPin.pinUuid)
      // find the amount of pins that are duplicates
      const duplicates = pinsToAddToDB.filter(pin => pin.pinUuid === alreadyOwnedPin.pinUuid).length
      if (pinsAlreadyOwned) {
        // add the pin to the pinsToRemove array
        pinsToRemove.push(pinsAlreadyOwned)
        // add the duplicate to the already owned pin
        updateDoc(doc.ref, {
          duplicates: increment(duplicates),
        });
      }
    })
    // remove the duplicates from the pinsToAddToDB array
    pinsToAddToDB.forEach(pin => {
      const index = pinsToRemove.findIndex(pinToRemove => pinToRemove.pinUuid === pin.pinUuid)
      if (index !== -1) {
        pinsToAddToDB.splice(index, 1)
      }
    })
    // add the pins to the users pin collection
    // creat a batch to add the pins
    const batch = writeBatch(db);
    pinsToAddToDB.forEach(pin => {
      // add a doc with id of the pin uuid
      batch.set(doc(userPinsCollection, pin.pinUuid), pin);
    })
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
    const allPins = await getAllPins()
    if (!allPins) return
    let worldsWithPins: WorldPinsToOpenType[] = []
    for (const world in countOfEachWorld) {
      const pinsToOpen = allPins.filter(pin => pin.worldName === world).sort(() => Math.random() - 0.5).slice(0, countOfEachWorld[world])
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
      const pinsWithUserOwnedData = allPins.map(pin => {
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
    allPins.forEach(pin => {
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