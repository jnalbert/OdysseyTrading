
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
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const ButtonText = styled.Text`
  color: #FFFFFF;
  text-align: center;
  font-family: ${GrandstanderExtraBold};
  font-size: 15px;
  /* font-weight: 600; */
  /* line-height: 24px; */
`
const PaddedView = styled.View`
  /* padding: 11px 0px; */
`

interface BasicButtonProps {
  title: string
  onPress: () => void;
  style?: {};
  buttonTextStyle?: {};
  gradient?: boolean;
  isDisabled?: boolean;
  boxShadow?: boolean;
  border?: boolean;
}

const BasicButton: FC<BasicButtonProps> = ({ title, onPress, style, buttonTextStyle, isDisabled, boxShadow, border }) => {
  
  const isBorderStyles = border ? { borderColor: '#000000', borderWidth: 2 } : {};
  const isBoxShadowStyles = boxShadow ? { boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' } : {};
  const DisplayMeat = () => {
    return (
        <TouchableButtonWrapper disabled={isDisabled} style={[style, isBorderStyles, isBoxShadowStyles]} onPress={onPress}>
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