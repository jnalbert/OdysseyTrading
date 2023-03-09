//@ts-ignore
import { CacheManager } from 'expo-cached-image'
import { getAllPinSrcs } from './FirestoreFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sha256 from "crypto-js/sha256";
import { PinTypeDB } from './types/PinAndWorldType';

export const cacheOneImageWithTime = async (src: string) => {
  try {
    const startTime = Date.now();
    const cacheKey = sha256(src);
    await CacheManager.downloadAsync({uri: `${src}`, key: `${cacheKey}`})
    const endTime = Date.now();
    // dipslay the time it took to cache all images in seconds
    return ((endTime - startTime) / 1000)
  } catch (error) {
    console.log(error)
  }
}
export const loadInitialImagesToCache = async () => {
  try {
    // await AsyncStorage.removeItem("areImagesCached");
    // const areImagesCached = JSON.parse(await AsyncStorage.getItem("areImagesCached") || "")
    // console.log("areImagesCached", areImagesCached)
    
    const areImagesCached = JSON.parse(await AsyncStorage.getItem("areImagesCached") || "false")
    console.log("areImagesCached", areImagesCached)
    if (!areImagesCached) {
      console.log("Starting Caching Images")
      const allPinSrcs = await getAllPinSrcs();
      // console.log(allPinSrcs)
      const startTime = Date.now();
      for (let i = 0; i < allPinSrcs.length; i++) {
        const cannotContinue = JSON.parse(await AsyncStorage.getItem("areImagesCached") || "false")
        if (cannotContinue) {
          console.log("Caching Stopped")
          break;
        }
        const src = allPinSrcs[i];
        const cacheKey = sha256(src);
        await CacheManager.downloadAsync({uri: `${src}`, key: `${cacheKey}-105`})
      }
      const endTime = Date.now();
      // dipslay the time it took to cache all images in seconds
      console.log("Time to cache all images", (endTime - startTime) / 1000)
    
      await AsyncStorage.setItem("areImagesCached", "true");
      console.log("Images All Cached")
    }
  } catch (error) {
    console.log(error)
  }
}

export const getPinsDataFromCache = async () => {
  try {

    // // AsyncStorage.setItem("Testing1234", JSON.stringify([{id: "1234", title: "Testing1234"}]))
    // const getTestingItem = JSON.parse(await AsyncStorage.getItem("Testing1234") || "")
    // console.log(getTestingItem)

    // check if pin cache time to expire exists or has past it's time
    const pinCacheTimeToExpire = await AsyncStorage.getItem("pinCacheTimeToExpire")
    // check if pin Cache time to expire was over one month ago
    if (!pinCacheTimeToExpire || JSON.parse(pinCacheTimeToExpire) < Date.now()) return null
    // get pins data from cache
    console.log("Getting Pins From Cache")
    const cachedPinsData = JSON.parse(await AsyncStorage.getItem("cachedPinsData") || "[]")
    return cachedPinsData
  } catch (error) {
    console.log(error)
  }
}

export const setPinsDataToCache = async (pinsData: PinTypeDB[]) => {
  try {
    console.log("Caching Pins")
    // set pins data to cache
    await AsyncStorage.setItem("cachedPinsData", JSON.stringify(pinsData));
    // set pins data cache time to expire
    const pinCacheTimeToExpire = Date.now() + (1000 * 60 * 60 * 24 * 30)
    await AsyncStorage.setItem("pinCacheTimeToExpire", JSON.stringify(pinCacheTimeToExpire));
  } catch (error) {
    console.log(error)
  }
}