import React, { FC } from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { GrandstanderSemiBold, Peach } from "../../shared/colors";
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import MyCollectionScreen from "../../screens/main/collection/MyCollectionScreen";
import HeaderNewPinNotification from "../../components/mainComps/collection/HeaderNewPinNotification";
import OpenPacksScreen from "../../screens/main/collection/OpenPacksScreen";

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
        initialParams={{ newPinNotifications: 0 }}
        options={({ route, navigation }) => ({
          headerTitle: "My Collection",
          headerRight: () => {
            // @ts-ignore
            return <HeaderNewPinNotification navigation={navigation} notification={route?.params?.newPinNotifications || 0}/>;
          },
          headerRightContainerStyle: {
            // marginLeft: "20%",
            // height: "150%",
            justifyContent: "center",
            alignItems: "center",
          },
          // headerShown: false,
        })}
      />

      <Stack.Screen
        name="OpenPacks"
        component={OpenPacksScreen}
        options={{
          headerTitle: "Open Packs",
          headerLeft: () => null
          // headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default CollectionStackNavigator;
