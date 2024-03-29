import React, { FC, useEffect, useState } from "react";
import { Linking, View } from "react-native";
import styled from "styled-components/native";
import DisplayPinSlider from "../../../components/mainComps/shop/DisplayPinSlider";
import PickPackButton from "../../../components/mainComps/shop/PickPackButton";
import BasicButton from "../../../shared/BasicButton";
import {
  BlueGreen,
  GrandstanderExtraBold,
  GrandstanderMedium,
  GrandstanderSemiBold,
  MulishMedium,
  Orange,
  Peach,
} from "../../../shared/colors";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";
import { _getUuid } from "../../../AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';

const PinSliderWrapper = styled.View`
  /* height: 100%; */
  width: 100%;
`;

const PacksPickerWrapper = styled.View`
  padding: 15px;
  margin-top: 11%;
  height: 160px;
  width: 101%;
  background-color: ${BlueGreen};
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  border: 2px solid #000000;
`;

const PacksHeaderText = styled.Text`
  font-family: ${GrandstanderMedium};
  font-size: 34px;
  color: ${Peach};
`;
const PacksButtonsWrapper = styled.View`
  margin-top: 3%;
  flex-direction: row;
  width: 85%;
  justify-content: space-between;
`;

const RandomTextWrapper = styled.View`
  margin-top: 4%;
  width: 100%;
  align-items: flex-start;
`;

const RandomText = styled.Text`
  font-family: ${MulishMedium};
  color: ${Peach};
  text-align: left;
`;

const BuyingSectionWrapper = styled.View`
  margin-top: 8%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 87%;
`;

const PriceText = styled.Text`
  font-family: ${GrandstanderExtraBold};
  font-size: 48px;
  color: ${Orange};
`;

const BuyButtonWrapper = styled.View`

`

export interface SavedCartItem {
    pack: number;
    price: number;
    quantity: number;
}

export const saveItemsToCartStorage = async (cartData: SavedCartItem[]) => {
  // console.log("saved cart", cartData)
  // console.log("Saving", cartData)
  await AsyncStorage.setItem("cart", JSON.stringify(cartData));
}

export const getCartItems = async () => {
  const cartRaw = await AsyncStorage.getItem("cart");
  if (cartRaw) {
      const cart = JSON.parse(cartRaw);
      // console.log("first cart", cart)
      return cart
  }
}

const PackPrices: any = {
  2: 20.0,
  4: 38.0,
  6: 55.0,
};

const ShopScreen: FC<any> = ({navigation, route}) => {
  const [currentPack, setCurrentPack] = React.useState(2);
  const [currentCart, setCurrentCart] = React.useState<SavedCartItem[]>([]);

  const handlePackPress = (pack: number) => {
    setCurrentPack(pack);
  };

  const handleAddToCartPress = () => {
    // console.log("buying pins");
    setCurrentCart((prevCart) => {
        const cartItem = prevCart.find((item) => item.pack === currentPack);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            prevCart.push({
            pack: currentPack,
            price: PackPrices[currentPack],
            quantity: 1,
            });
        }
        return [...prevCart];
        });
        const quantity = currentCart.reduce((accValue: number, item: SavedCartItem) => accValue + item.quantity, 0);
        navigation.setParams({ itemsInCart: quantity });
        navigation.setParams({ cart: currentCart });
  };


  const setInitialCartItems = async () => {
    let cart: SavedCartItem[];

    const {cartFromCartScreen} = route.params
    // console.log("From Cart Screen", cartFromCartScreen)

    if (cartFromCartScreen) {
      cart = cartFromCartScreen
    } else {
        cart = (await getCartItems()) || []
    }
   
    setCurrentCart(cart);
    const quantity = cart.reduce((accValue: number, item: SavedCartItem) => accValue + item.quantity, 0);
    // console.log(quantity)
    navigation.setParams({ itemsInCart: quantity });
    navigation.setParams({ cart: cart });
  }

  const isFocused = useIsFocused();
  const [wasOutOfFocus, setWasOutOfFocus] = useState(false)

  useEffect(() => {
      if (!isFocused) {
        if (!wasOutOfFocus) {
          saveItemsToCartStorage(currentCart);
        }
        setWasOutOfFocus(true)
          // console.log("saving items")
      }
      if (isFocused) {
        setWasOutOfFocus(false)
          setInitialCartItems();
          // console.log("gettting items")
      }
  }, [isFocused])

  return (
    <ScreenWrapperComp backgroundColor={Peach} scrollView noMargin>
      <PinSliderWrapper>
        <DisplayPinSlider />
      </PinSliderWrapper>

      <PacksPickerWrapper>
        <PacksHeaderText>Packs</PacksHeaderText>
        <PacksButtonsWrapper>
          <PickPackButton
            pack={2}
            currentPack={currentPack}
            handlePackPress={handlePackPress}
          />
          <PickPackButton
            pack={4}
            currentPack={currentPack}
            handlePackPress={handlePackPress}
          />
          <PickPackButton
            pack={6}
            currentPack={currentPack}
            handlePackPress={handlePackPress}
          />
        </PacksButtonsWrapper>
        <RandomTextWrapper>
          <RandomText>*not real currency, for display only</RandomText>
        </RandomTextWrapper>
      </PacksPickerWrapper>
      <BuyingSectionWrapper>
        <PriceText>${PackPrices[currentPack]}.00</PriceText>
        <BuyButtonWrapper>
          <BasicButton
            title="ADD TO CART"
            style={{
              width: 165,
              height: 65,
              backgroundColor: Orange,
              borderRadius: 18,
              }}
            buttonTextStyle={{
              fontFamily: GrandstanderSemiBold,
              fontSize: 24,
              color: Peach,
            }}
            onPress={handleAddToCartPress}
            border
            boxShadow
          />
        </BuyButtonWrapper>
      </BuyingSectionWrapper>
    </ScreenWrapperComp>
  );
};

export default ShopScreen;
