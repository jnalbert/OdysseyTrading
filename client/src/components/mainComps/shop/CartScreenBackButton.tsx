import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { SavedCartItem } from '../../../screens/main/shop/ShopScreen';
import { MaterialIcons } from '@expo/vector-icons'; 

const OverallWrapper = styled.TouchableOpacity`
  /* padding-left: 20px; */
`

const StyledView = styled.View`
  padding-left: 20px;
  padding-top: 8px;
`

interface Props {
  navigation: any;
  cartData: SavedCartItem[]
}

const CartScreenBackButton: FC<Props> = ({
  cartData,
  navigation
}) => {

  const goBackToShop = () => {
    navigation.navigate('Shop', {cartFromCartScreen: cartData})
  }
  return (
    <OverallWrapper onPress={() => goBackToShop()}>
      <StyledView>
        <MaterialIcons name="keyboard-backspace" size={24} color="black" />
      </StyledView>
    </OverallWrapper>
  )
}

export default CartScreenBackButton