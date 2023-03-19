import React, { FC, useState, useEffect } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { GrandstanderSemiBold, Pink } from '../../../shared/colors';
import { AntDesign } from '@expo/vector-icons'; 

const OverAllWrapper = styled.View`
  /* height: 50px;
  width: 50px; */
  margin-left: 45%;
  /* background-color: red; */
  
`

const NotificationWrapper = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`
const NumberWrapper = styled.View`
  position: absolute;
  top: -2px;
  right: -3px;
  height: 22px;
  width: 22px;
  border-radius: 11px;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: ${Pink};
`
const NumberText = styled.Text`
  font-size: 12px;
  color: white;
  font-size: ${GrandstanderSemiBold};
`


interface Props {
    navigation: any
    itemsInCart: number
}

const HeaderItemsInCart: FC<Props> = ({
    navigation,
    itemsInCart
}) => {
  const [itemsInCartState, setItemsInCartState] = useState(0)

  useEffect(() => {
    // setItemsInCartState(itemsInCart)
    setItemsInCartState(1)
  }, [itemsInCart])

  const handleCartPress = () => {
    navigation.navigate('Cart')
  }

  return (
    <OverAllWrapper>
      <NotificationWrapper onPress={handleCartPress}>
        {itemsInCartState > 0 && (
          <NumberWrapper>
            <NumberText>{itemsInCartState}</NumberText>
          </NumberWrapper>
        )}
        <AntDesign name="shoppingcart" size={35} color="black" />
      </NotificationWrapper>
    </OverAllWrapper>
  )
}

export default HeaderItemsInCart