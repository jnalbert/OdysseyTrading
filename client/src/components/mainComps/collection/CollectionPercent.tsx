import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { WorldType } from '../../../screens/main/collection/MyCollectionScreen';
import { BlueGreen, GrandstanderMedium } from '../../../shared/colors';

const OverallWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`
const WorldName = styled.Text`
  font-family: ${GrandstanderMedium};
  font-size: 22px;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
`
const PercentageWrapper = styled.View`
  margin-left: 5%;
  width: 34%;
  height: 15px;
  border-radius: 20px;
  padding: 2px;
  border: 1px solid #000000;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const InnerPercentageView = styled.View`
  height: 100%;
  border-radius: 20px;
`

const PercentageText = styled.Text`
  margin-left: 2%;
  font-family: ${GrandstanderMedium};
  font-size: 16px;
  /* text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25); */
`

interface Props {
  world: WorldType | undefined
}

const CollectionPercent: FC<Props> = ({
  world
}) => {
  let worldName = ''
  let color = 'black'
  let percentage = 0
  if (world) {
    worldName = world?.worldName
    color = world?.worldColor
    // get the percentage as a number wit no decimals
    percentage = Math.floor((world?.numPinsCollected / world?.numPinsInWorld * 100) || 0)
  }
  return (
    <OverallWrapper>
      <WorldName style={{color: color}}>{worldName}</WorldName>
    <PercentageWrapper>
      <InnerPercentageView style={{width: `${percentage}%`, backgroundColor: color}}></InnerPercentageView>
    </PercentageWrapper>
    <PercentageText style={{color: color}} >{percentage}%</PercentageText>
    </OverallWrapper>
  )
}

export default CollectionPercent