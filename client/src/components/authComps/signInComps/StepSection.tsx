import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { Black, BlueGreen, GrandstanderSemiBold, MulishMedium } from '../../../shared/colors';

const OverallWrapper = styled.View`
  width: 80%;
  margin: 19px 0px;
`

const TextStyle = styled.Text`
  font-family: ${MulishMedium};
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: ${Black};
`

const StepText = styled(TextStyle)`
  margin-bottom: 12px;
  font-family: ${GrandstanderSemiBold};
  color: ${BlueGreen};
`

export interface StepsSectionProps { 
  step: number;
  body: string;
}

const StepSection: FC<StepsSectionProps> = ({step, body}) => {
  return (
    <OverallWrapper>
      <StepText>Step: {step}</StepText>
      <TextStyle>{body}</TextStyle>
  </OverallWrapper>
  )
}

export default StepSection