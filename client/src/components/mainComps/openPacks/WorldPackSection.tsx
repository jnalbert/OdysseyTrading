import React, { FC, useState } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { WorldPinsToOpenType } from '../../../screens/main/collection/OpenPacksScreen';
import { GrandstanderExtraBold } from '../../../shared/colors';
import PinLotterySlider from './PinLotterySlider';

const OverallWrapper = styled.View`
  width: 100%;
  margin-top: 5%;
  justify-content: flex-start;
`

const WorldHeaderWrapper = styled.View`
  margin-top: 5%;
`

const WorldHeader = styled.Text`
  font-family: ${GrandstanderExtraBold};
  font-size: 24px;
`

const PinsSectionHeaderWrapper = styled.View`
  width: 100%;
  margin-top: 5%;
  flex-direction: row;
  flex-wrap: wrap;
`

interface Props extends WorldPinsToOpenType {
  flipIndividualPin: (worldIndex: number, pinIndex: number) => void;
  worldIndex: number;
}


const WorldPackSection: FC<Props> = ({
  world,
  color,
  pickedPins,
  worldIcon,
  flipIndividualPin,
  worldIndex
}) => {

  const pinLotteryObjects = () => {
    const lotteryObjects = []
    // look through the pickedPins object and make a PinLotterySlider for each pin
    for (let i = 0; i < pickedPins.length; i++) {

      lotteryObjects.push(
        <PinLotterySlider 
        pinIndex={i}
        worldIndex={worldIndex}
        flipIndividualPin={flipIndividualPin}
        key={pickedPins[i].uuid + "" + i}
          pinSrc={pickedPins[i].src}
          worldIcon={worldIcon}
          isShown={pickedPins[i].isShown}
        />
      )
    }
    return lotteryObjects
  }
  
  return (
    <OverallWrapper>
      <WorldHeaderWrapper>
        <WorldHeader style={{color: color}}>{world}</WorldHeader>
    </WorldHeaderWrapper>
    <PinsSectionHeaderWrapper>
      {pinLotteryObjects()}
    </PinsSectionHeaderWrapper>
    </OverallWrapper>
  )
}

export default WorldPackSection