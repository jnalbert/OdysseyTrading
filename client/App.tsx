import React, { FC, useEffect, useMemo, useReducer, useState } from "react";
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Grandstander_500Medium, Grandstander_600SemiBold, Grandstander_800ExtraBold } from "@expo-google-fonts/grandstander";
import { Mulish_500Medium, Mulish_700Bold } from "@expo-google-fonts/mulish";

export default function App() {

    let [isFontLoaded] = useFonts({
        "GrandstanderExtraBold": Grandstander_800ExtraBold,
        "GrandstanderSemiBold": Grandstander_600SemiBold,
        "GrandstanderMedium": Grandstander_500Medium,
        "MulishBold": Mulish_700Bold,
        "MulishMedium": Mulish_500Medium,
      });
      
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
