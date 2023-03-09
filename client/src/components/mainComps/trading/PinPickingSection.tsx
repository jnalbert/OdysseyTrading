import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { PinTypeDB } from '../../../../firebase/types/PinAndWorldType';
import { WorldPinsToOpenType } from '../../../screens/main/collection/OpenPacksScreen';
import { PinsType } from '../../../screens/main/trading/TradingInProgressScreen';
import { GrandstanderExtraBold } from '../../../shared/colors';
import PinPickCard from './PinPickCard';

const OverallWrapper = styled.View`
  width: 100%;
  margin-top: 5%;
  justify-content: flex-start;
`

const WorldHeaderWrapper = styled.View`
  /* margin-top: 5%; */
`

const WorldHeader = styled.Text`
  font-family: ${GrandstanderExtraBold};
  font-size: 24px;
`

const PinsSectionHeaderWrapper = styled.View`
  width: 100%;
  margin-top: 3%;
  flex-direction: row;
  flex-wrap: wrap;
`

interface Props {
  worldName: string;
  worldColor: string;
  worldPins: PinTypeDB[];
  isPinConfirmed: boolean;
  currentSelection:  PinTypeDB | null;
  handleClick: (pin: PinTypeDB) => void;
}


const PinPickingSection: FC<Props> = ({
  worldName,
  worldColor,
  worldPins,
  isPinConfirmed,
  currentSelection,
  handleClick
}) => {
  return (
    <OverallWrapper>
      <WorldHeaderWrapper>
        <WorldHeader style={{color: worldColor}}>{worldName}</WorldHeader>
    </WorldHeaderWrapper>
    <PinsSectionHeaderWrapper>
      {worldPins.map((pin, index) => {
        const isSelected = currentSelection?.uuid === pin.uuid
        return <PinPickCard isPinConfirmed={isPinConfirmed} key={index} pin={pin} isSelected={isSelected} handleClick={handleClick} />
      })}
    </PinsSectionHeaderWrapper>
    </OverallWrapper>
  )
}

export default PinPickingSection