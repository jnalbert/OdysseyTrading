import React, { FC } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Black, BlueGreen } from "../../shared/colors";

import { AntDesign, Feather } from "@expo/vector-icons";
import CollectionStackNavigator from "./CollectionStackNavigator";
import ShopScreen from "../../screens/main/ShopScreen"
import TradingStackNavigator from "./TradingStackNavigator";
import SocialMediaScreen from "../../screens/main/socialMedia/SocialMediaScreen";
import ProfileStackNavigator from "./ProfileStackNavigator";

const Tab = createBottomTabNavigator();

const MainTabNavigator: FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: BlueGreen,
        tabBarInactiveTintColor: Black,
        tabBarShowLabel: false,
        tabBarItemStyle: { paddingTop: "2.5%" },
        tabBarStyle: { height: "10%" },
        tabBarIcon: ({ color }) => {
          if (route.name === "MyCollectionNav") {
            return <Feather name="inbox" size={30} color={color} />;
          }
          if (route.name === "Shop") {
            return <AntDesign name="shoppingcart" size={30} color={color} />;
          }
          if (route.name === "TradingNav") {
            return <AntDesign name="swap" size={30} color={color} />;
          }
          if (route.name === "SocialMediaNav") {
            return <AntDesign name="mobile1" size={30} color={color} />;
          }
          return <AntDesign name="user" size={30} color={color} />;
        },
      })}
    >
      <Tab.Screen
        options={{ headerTitle: "My Collection", headerShown: false }}
        name="MyCollectionNav"
        component={CollectionStackNavigator}
      />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen
        options={{ headerTitle: "Trading", headerShown: false }}
        name="TradingNav"
        component={TradingStackNavigator}
      />
      <Tab.Screen
        options={{ headerTitle: "Social Media", headerShown: true }}
        name="SocialMediaNav"
        component={SocialMediaScreen}
      />
      <Tab.Screen
        options={{ headerTitle: "Profile Screen", headerShown: false }}
        name="ProfileScreenNav"
        component={ProfileStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
