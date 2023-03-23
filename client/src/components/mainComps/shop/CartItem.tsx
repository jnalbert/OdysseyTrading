import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'

interface Props {
    pack: number
    price: number
    quantity: number
    onRemove: (pack: number) => void
    onChangeQuantity: (pack: number, quantity: number, ) => void
}

const CartItem: FC<Props> = ({
    pack,
    price,
    quantity,
    onRemove,
    onChangeQuantity
}) => {
  return (
    <View>
      
    </View>
  )
}

export default CartItem