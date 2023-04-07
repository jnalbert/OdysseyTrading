import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';

interface Props {
    navigation: any;
    route: any;
}

const PurchaseCompletedScreen: FC<Props> = ({
    navigation,
    route,
}) => {
    const {itemsBought} = route.params;
    console.log(itemsBought)
  return (
    <ScreenWrapperComp>
      
    </ScreenWrapperComp>
  )
}

export default PurchaseCompletedScreen