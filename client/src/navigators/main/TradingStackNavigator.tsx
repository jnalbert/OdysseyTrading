import React, { FC } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { GrandstanderSemiBold, Peach } from '../../shared/colors';
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import MainTradingScreen from "../../screens/main/trading/MainTradingScreen";
import TradingInProgressScreen from "../../screens/main/trading/TradingInProgressScreen";
import TradingCompletedScreen from "../../screens/main/trading/TradingCompletedScreen";

const Stack = createStackNavigator();

const TradingStackNavigator: FC = () => {
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
        name="MainTrading"
        component={MainTradingScreen}
        options={{
          headerTitle: "Trading",
          headerStyle: {},
          // headerShown: false,
        }}
      />

      <Stack.Screen
        name="TradingInProgress"
        component={TradingInProgressScreen}
        options={{
          headerTitle: "Trading In Progress",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Trading Completed"
        component={TradingCompletedScreen}
        options={{
          headerTitle: "Trading Completed",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default TradingStackNavigator;
