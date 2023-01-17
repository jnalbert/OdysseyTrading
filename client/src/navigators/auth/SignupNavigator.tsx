import React, { FC } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { backgroundColor } from "../../shared/colors";
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import StackHeader from "../../shared/StackHeader/StackHeader";
import SignUpScreen from "../../screens/auth/SignupScreen";
import TermsOfService from "../../screens/auth/TermsOfService";

const Stack = createStackNavigator();

const SignUpNavigator: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: backgroundColor,
        borderBottomColor: backgroundColor,
        shadowColor: "transparent",
      },
      headerBackImage: () => <StackHeaderBackButton />,
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{
        headerTitle: () => <StackHeader name="" />,
        // headerShown: false
      }}
    />

    <Stack.Screen
      name="TOS"
      component={TermsOfService}
      options={{
        headerTitle: () => <StackHeader name="Terms Of Service" />,
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export default SignUpNavigator;
