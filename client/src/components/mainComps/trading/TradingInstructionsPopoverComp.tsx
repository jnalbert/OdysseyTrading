import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { BlueGreen, GrandstanderExtraBold, MulishMedium, Orange } from '../../../shared/colors';

const OverallView = styled.View`
  /* padding: 10px; */
  flex-direction: column;
  align-items: center;
  height: 320px;
  width: 300px;
`

const StepHeaderText = styled.Text`
  font-family: ${GrandstanderExtraBold};
  font-size: 19px;
  text-align: center;
  color: ${BlueGreen};
  margin-top: 10px;
`

const StepText = styled.Text`
  font-family: ${MulishMedium};
  font-size: 12px;
  text-align: center;
  color: ${"#181D2D"};
  margin-top: 5px;
  width: 85%;
`

const ScanIconWrapper = styled.View`
  margin-top: 7px;
  margin-bottom: 5px;
`

const TradingInstructionsPopoverComp: FC = () => {
  return (
    <OverallView>
      <StepHeaderText>Step 1</StepHeaderText>
      <StepText>Find a ody-friend to trade with!!!</StepText>
      <StepHeaderText>Step 2</StepHeaderText>
      <StepText>Either you or your friend press the “Start Trading” button and a QR code will appear</StepText>
      <StepHeaderText>Step 3</StepHeaderText>
      <StepText>Have the opposite person press the following icon next to the username</StepText>
      <ScanIconWrapper>
        <MaterialCommunityIcons name="qrcode-scan" size={25} color={BlueGreen} />
      </ScanIconWrapper>
      <StepText>Then orient the QR code in the frame of the camera and the trade will begin</StepText>
      <StepHeaderText
        style={{
          color: Orange,
          marginTop: 20,
          fontSize: 24,
        }}
      >Now Start Trading!!!!</StepHeaderText>
    </OverallView>
  )
}

export default TradingInstructionsPopoverComp