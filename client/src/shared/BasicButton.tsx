
import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { BlueGreen, GrandstanderExtraBold } from './colors';
// import { LinearGradient } from 'expo-linear-gradient';

const TouchableButtonWrapper = styled.TouchableOpacity`
  align-items: center;
  width: 100px;
  justify-content: center;
  background-color: ${BlueGreen};
  border-radius: 12px;
  height: 50px;
`

const ButtonText = styled.Text`
  color: #FFFFFF;
  text-align: center;
  font-family: ${GrandstanderExtraBold};
  font-size: 15px;
  font-weight: 600;
  /* line-height: 24px; */
`
const PaddedView = styled.View`
  padding: 11px 0px;
`

interface BasicButtonProps {
  title: string
  onPress: () => void;
  style?: {};
  buttonTextStyle?: {};
  gradient?: boolean;
  isDisabled?: boolean;
}

const BasicButton: FC<BasicButtonProps> = ({ title, onPress, style, buttonTextStyle, isDisabled }) => {
  
  const DisplayMeat = () => {
    return (
        <TouchableButtonWrapper disabled={isDisabled} style={style} onPress={onPress}>
          <ButtonText style={buttonTextStyle} >{title}</ButtonText>
        </TouchableButtonWrapper>
    )
  }

  return (
    <PaddedView>
        {DisplayMeat()}
    </PaddedView>
    )
}

// linear gradient code 
{/* <PaddedView>
<LinearGradient start={{ x: 0.2, y: 0.3 }} end={{x: 0.77, y: 0.4}} colors={[Pink, Purple]} style={{ justifyContent: "center", borderRadius: 16}}>
  {DisplayMeat()}
</LinearGradient>
</PaddedView> */}
export default BasicButton