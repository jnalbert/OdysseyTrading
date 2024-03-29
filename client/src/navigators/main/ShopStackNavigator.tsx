import React, { FC } from "react";
import {} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { GrandstanderSemiBold, Peach } from "../../shared/colors";
import StackHeaderBackButton from "../../shared/StackHeader/StackHeaderBackButton";
import ShopScreen from "../../screens/main/shop/ShopScreen";
import CartScreen from "../../screens/main/shop/CartScreen";
import PurchaseCompletedScreen from "../../screens/main/shop/PurchaseCompletedScreen";
import HeaderItemsInCart from "../../components/mainComps/shop/HeaderItemsInCart";
import CartScreenBackButton from "../../components/mainComps/shop/CartScreenBackButton";

const Stack = createStackNavigator();

const ShopStackNavigator: FC = () => {
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
        name="Shop"
        component={ShopScreen}
        initialParams={{ itemsInCart: 0, cart: [] }}
        options={({ route, navigation }: any) => ({
          headerTitle: "Shop",
          headerRight: () => {
            return (
              <HeaderItemsInCart
                navigation={navigation}
                itemsInCart={route?.params?.itemsInCart || 0}
                cart={route?.params?.cart || []}
              />
            );
          },
          headerRightContainerStyle: {
            justifyContent: "center",
            alignItems: "center",
          },
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        initialParams={{ cart: [], actualBoughtData: [] }}
        options={({ route, navigation }: any) => ({
          headerLeft: () => {
            return (
              <CartScreenBackButton
                navigation={navigation}
                cartData={route?.params?.cart || []}
              />
            );
          },
          headerTitle: "Cart",
        })}
      />
      <Stack.Screen
        name="PurchaseCompleted"
        component={PurchaseCompletedScreen}
        options={{
          headerTitle: "Purchase Completed",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopStackNavigator;
