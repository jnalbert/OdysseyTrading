import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import styled from "styled-components/native";
import { loadAsync, useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import {
  Grandstander_500Medium,
  Grandstander_600SemiBold,
  Grandstander_800ExtraBold,
} from "@expo-google-fonts/grandstander";
import { Mulish_500Medium, Mulish_700Bold } from "@expo-google-fonts/mulish";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./src/navigators/main/MainTabNavigator";
import AuthNavigator from "./src/navigators/auth/AuthNavigator";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import {
  AuthContext,
  AuthContextFunctionTypes,
  authReducer,
  AuthTypes,
  getTokenAsync,
  useMemoFunction,
} from "./src/AppContext";
import { loadInitialImagesToCache } from "./firebase/CachingFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Host } from 'react-native-portalize';

const AppWrapperView = styled.View`
  flex: 1;
`;

preventAutoHideAsync();

const App: FC<any> = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  const [state, dispatch]: [AuthTypes, React.Dispatch<any>] = useReducer(
    authReducer,
    {
      isLoading: true,
      isSignout: false,
      userUuid: null,
    }
  );

  const authContext = useMemo<AuthContextFunctionTypes>(
    () => useMemoFunction(dispatch, state),
    []
  );

  useEffect(() => {
    async function loadData() {
      try {
        // loading fonts
        await loadAsync({
          GrandstanderExtraBold: Grandstander_800ExtraBold,
          GrandstanderSemiBold: Grandstander_600SemiBold,
          GrandstanderMedium: Grandstander_500Medium,
          MulishBold: Mulish_700Bold,
          MulishMedium: Mulish_500Medium,
        });
        // do other fetches here
        // ***************

        loadInitialImagesToCache()

      } catch (error) {
        console.warn(error);
      } finally {
        setIsAppReady(true);
      }
    }

    loadData();
    getTokenAsync(dispatch);

  }, []);

  useEffect(() => {
    if (state.userUuid !== null) {
      // cancels The image caching
      AsyncStorage.setItem("areImagesCached", "true");
    }
    console.log(state.userUuid)
  }, [state.userUuid])

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady && !state.isLoading) {
      // Hides the splash screen
      await hideAsync();
    }
  }, [isAppReady, state.isLoading]);

  if (!isAppReady || state.isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer onReady={onLayoutRootView}>
        <Host>
          <AppWrapperView>
            {state?.userUuid === null ? <AuthNavigator /> : <MainTabNavigator />}
          </AppWrapperView>
        </Host>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
