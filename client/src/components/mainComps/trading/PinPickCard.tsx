import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { PinsType } from '../../../screens/main/trading/TradingInProgressScreen';
import { Pink } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';

const OverallWrapper = styled.TouchableOpacity`
  height: 80px;
  width: 70px;
  border-radius: 20px;
  /* border-width: 3px; */
  justify-content: center;
  align-items: center;
  margin: 2px;
`
const PinWrapper = styled.View`
  height: 80%;
  width: 80%;
`

interface Props {
  handleClick: (pin: PinsType) => void;
  isSelected: boolean;
  isPinConfirmed: boolean;
  pin: PinsType;
}

const PinPickCard: FC<Props> = ({
  handleClick,
  isSelected, 
  isPinConfirmed,
  pin
}) => {
  let backgroundStyles;
  if (isSelected) {
    backgroundStyles = {
      borderColor: Pink,
    backgroundColor: "#f56d6d7f",
    borderWidth: 3
      // opacity: 0.5
    }
    if (isPinConfirmed) {
      backgroundStyles = {
        borderColor: '#2DDB29',
        backgroundColor: "#2cdb297f",
        borderWidth: 3
        // opacity: 0.5
      }
    }
  }
  return (
    <OverallWrapper style={[backgroundStyles]} onPress={() => handleClick(pin)}>
      <PinWrapper> 
        { pin.fullColorSrc && (
          <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode={"contain"} src={pin.fullColorSrc} />
        )}

      </PinWrapper>
    </OverallWrapper>
  )
}

export default PinPickCard