import React, { FC } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Peach } from "../../shared/colors";
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import SignInScreen from "../../screens/auth/SignInScreen";
import StackHeader from "../../shared/StackHeader/StackHeader";
import ForgotPasswordScreen from "../../screens/auth/ForgotPasswordScreen";
import ForgotPasswordStepsScreen from "../../screens/auth/ForgotPasswordStepsScreen";

const Stack = createStackNavigator();

const SignInNavigator: FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: Peach,
        // borderBottomColor: Peach,
        shadowColor: "transparent",
      },
      headerBackImage: () => <StackHeaderBackButton />,
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        headerTitle: () => <StackHeader name="" />,
        // headerShown: false
      }}
    />

    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{
        headerTitle: () => <StackHeader name="" />,
        // headerShown: false
      }}
    />

    <Stack.Screen
      name="ForgotPasswordSteps"
      component={ForgotPasswordStepsScreen}
      options={{
        headerTitle: () => <StackHeader name="" />,
        // headerShown: false
      }}
    />
  </Stack.Navigator>
);

export default SignInNavigator;
