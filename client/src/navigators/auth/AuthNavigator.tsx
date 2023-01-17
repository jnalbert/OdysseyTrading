import React, { FC } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { backgroundColor } from "../../shared/colors";
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import IntroScreen from "../../screens/auth/IntroScreen";
import StackHeader from "../../shared/StackHeader/StackHeader";
import SignUpNavigator from "./SignUpNavigator";
import SignInNavigator from "./SignInNavigator";

const Stack = createStackNavigator();

const AuthNavigator: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: backgroundColor,
        borderBottomColor: backgroundColor,
        shadowColor: "transparent",
      },
      headerBackImage: () => {
        return <StackHeaderBackButton />;
      },
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="Intro"
      component={IntroScreen}
      options={{
        headerTitle: () => <StackHeader name="" />,
        // headerShown: false,
      }}
    />

    <Stack.Screen
      name="SignUpNav"
      component={SignUpNavigator}
      options={{
        headerTitle: () => <StackHeader name="" />,
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="SignInNav"
      component={SignInNavigator}
      options={{
        headerTitle: () => <StackHeader name="" />,
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
