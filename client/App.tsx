import React, { FC, useEffect, useMemo, useReducer, useState } from "react";
import styled from "styled-components/native";
import { useFonts } from "expo-font";
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
import AppLoading from "expo-app-loading";

const AppWrapperView = styled.View`
  flex: 1;
`;

const App: FC<any> = () => {
  let [isFontLoaded] = useFonts({
    GrandstanderExtraBold: Grandstander_800ExtraBold,
    GrandstanderSemiBold: Grandstander_600SemiBold,
    GrandstanderMedium: Grandstander_500Medium,
    MulishBold: Mulish_700Bold,
    MulishMedium: Mulish_500Medium,
  });

  console.log(isFontLoaded);

  return (
    <>
      {!isFontLoaded ? (
        <AppLoading />
      ) : (
        <NavigationContainer>
          <AppWrapperView>
            <AuthNavigator />
          </AppWrapperView>
        </NavigationContainer>
      )}
    </>
  );
};

export default App;
