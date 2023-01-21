import React, { FC } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { backgroundColor, GrandstanderSemiBold } from '../../shared/colors';
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import ProfileScreen from "../../screens/main/profile/ProfileScreen";
import ChangePasswordScreen from "../../screens/main/profile/ChangePasswordScreen";

const Stack = createStackNavigator();

const ProfileStackNavigator: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
          borderBottomColor: backgroundColor,
          shadowColor: "transparent",
        },
        headerTitleStyle: {
          fontFamily: GrandstanderSemiBold,
          fontSize: 20,
        },
        headerBackImage: () => {
          return <StackHeaderBackButton />;
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Profile",
          headerStyle: {},
          // headerShown: false,
        }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerTitle: "Change Password",
          // headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
