import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import BasicButton from '../../../shared/BasicButton';
import { GrandstanderSemiBold, Orange, Peach } from '../../../shared/colors';
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';

export interface CartDataItem {
    pinsInPack: number;
    packPrice: number;
    quantity: number;
}

const CartScreen: FC = () => {
    function handleBuyPress(): void {
        console.log('buy')
    }

  return (
    <ScreenWrapperComp>
      <BasicButton
            title="BUY"
            style={{
              width: 165,
              height: 65,
              backgroundColor: Orange,
              borderRadius: 18
              }}
            buttonTextStyle={{
              fontFamily: GrandstanderSemiBold,
              fontSize: 42,
              color: Peach,
            }}
            onPress={handleBuyPress}
            border
            boxShadow
          />
    </ScreenWrapperComp>
  )
}

export default CartScreen