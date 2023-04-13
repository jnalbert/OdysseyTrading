import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { Black, BlueGreen, GrandstanderSemiBold, MulishBold, MulishMedium, Orange } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';

const OverallWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  width: 100%; 
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: white;
`

const WorldImagesWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 30%;
`

const CenterPriceWrapper = styled.View`
  flex-direction: column;
  width: 30%;
  justify-content: center;
  align-items: center;
`

const PackNumberText = styled.Text`
  margin-bottom: 10px;
  font-family: ${GrandstanderSemiBold};
  color: #000000;
  font-size: 20px;
`
const PackPriceText = styled.Text`
  /* margin-top: 10px; */
  font-family: ${GrandstanderSemiBold};
  color: ${Orange};
  font-size: 20px;
`

const RightChangeQuantityWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
`

const QuantityWrapper = styled.View` 
  flex-direction: row;
  width: 88%;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 8px;
`

const CircleButton = styled.TouchableOpacity`
  /* margin: 0px 10px 0px 10px; */
  flex-direction: row;
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  border: 1px solid #000000;
  justify-content: center;
  align-items: center;
  /* flex: 1; */
`

const CircleButtonText = styled.Text`
  text-align: center;
  font-family: ${MulishBold};
  font-size: 28px;
  line-height: 28px;
  color: #000000;
`

const QuantityText = styled.Text`
  font-family: ${MulishMedium};
  font-size: 20px;
`

const DeleteWrapper = styled.TouchableOpacity`
  
`

const DeleteText = styled.Text`

  font-family: ${MulishBold};
  font-size: 14px;
  color: ${BlueGreen};
  text-decoration-line: underline;
`

// cart png
// https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/CartWorldLogos-min.png

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
    <OverallWrapper>
      <WorldImagesWrapper>
        <MyCachedImage src={"https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/CartWorldLogos-min.png"} style={{height: 90, width: 90}} />
      </WorldImagesWrapper>
      <CenterPriceWrapper>
        <PackNumberText>{pack} Pack</PackNumberText>
        <PackPriceText>${price}.00</PackPriceText>
      </CenterPriceWrapper>
      <RightChangeQuantityWrapper>
        <QuantityWrapper>
          <CircleButton onPress={() => onChangeQuantity(pack, -1)} style={{backgroundColor: "white"}}>
            <CircleButtonText>-</CircleButtonText>
          </CircleButton>
          <QuantityText>{quantity}</QuantityText>
          <CircleButton onPress={() => onChangeQuantity(pack, 1)} style={{backgroundColor: BlueGreen}}>
            <CircleButtonText>+</CircleButtonText>
          </CircleButton>
        </QuantityWrapper>
        <DeleteWrapper onPress={() => onChangeQuantity(pack, -quantity)}>
          <DeleteText>delete</DeleteText>
        </DeleteWrapper>
      </RightChangeQuantityWrapper>
    </OverallWrapper>
  )
}

export default CartItem