//@ts-ignore
import { CacheManager } from 'expo-cached-image'
import { getAllPinSrcs } from './FirestoreFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sha256 from "crypto-js/sha256";

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
    // await AsyncStorage.setItem("areImagesCached", "false");
    // const areImagesCached = JSON.parse(await AsyncStorage.getItem("areImagesCached") || "")
    // console.log("areImagesCached", areImagesCached)
    
    const areImagesCached = JSON.parse(await AsyncStorage.getItem("areImagesCached") || "")
    // console.log("areImagesCached", areImagesCached)
    if (!areImagesCached) {
      console.log("Starting Caching Images")
      const allPinSrcs = await getAllPinSrcs();
      // console.log(allPinSrcs)
      const startTime = Date.now();
      for (let i = 0; i < allPinSrcs.length; i++) {
        const cannotContinue = JSON.parse(await AsyncStorage.getItem("areImagesCached") || "")
        if (cannotContinue) {
          console.log("Caching Stopped")
          break;
        }
        const src = allPinSrcs[i];
        const cacheKey = sha256(src);
        await CacheManager.downloadAsync({uri: `${src}`, key: `${cacheKey}-103`})
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