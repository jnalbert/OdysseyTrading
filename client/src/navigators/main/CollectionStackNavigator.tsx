import React, { FC } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { backgroundColor, GrandstanderSemiBold, Peach } from "../../shared/colors";
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import MyCollectionScreen from "../../screens/main/collection/MyCollectionScreen";

const Stack = createStackNavigator();

const CollectionStackNavigator: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Peach,
          borderBottomColor: Peach,
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
        name="MyCollection"
        component={MyCollectionScreen}
        options={{
          headerTitle: "My Collection",
          // headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default CollectionStackNavigator;
