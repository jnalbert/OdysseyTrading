import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { PinTypeDB } from '../../../../firebase/types/PinAndWorldType';
import { PinsType } from '../../../screens/main/trading/TradingInProgressScreen';
import { GrandstanderSemiBold, Pink } from '../../../shared/colors';
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
const QuantityWrapper = styled.View`
    position: absolute;
    height: 18px;
    width: 18px;
    border-radius: 9px;
    top: 0;
    right: 0;
    background-color: ${Pink};
    justify-content: center;
    align-items: center;
    z-index: 100;
`
const QuantityText = styled.Text`
    font-size: 12px;
    color: white;
    font-family: ${GrandstanderSemiBold};
`

interface Props {
  handleClick: (pin: PinTypeDB) => void;
  isSelected: boolean;
  isPinConfirmed: boolean;
  pin: PinTypeDB;
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
        {pin.duplicates && pin.duplicates > 1 && (
            <QuantityWrapper>
            <QuantityText>{pin.duplicates}</QuantityText>
        </QuantityWrapper>
        )}
        
      <PinWrapper> 
        { pin.src && (
          <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode={"contain"} src={pin.src} />
        )}

      </PinWrapper>
    </OverallWrapper>
  )
}

export default PinPickCard