import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { BlueGreen, GrandstanderExtraBold, Peach } from '../../../shared/colors';
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';

const ImageWrapper = styled.View`
  height: 40%;
  margin-top: 17%;
`

const SocialMediaImage = styled.Image`
  height: 100%;
  /* width: 100%; */
`

const SocialMediaText = styled.Text` 
  margin-top: 10%;  
  font-family: ${GrandstanderExtraBold};
  font-size: 40px;
  text-align: center;
  color: ${BlueGreen};
`

const SocialMediaScreen: FC = () => {
  return (
    <ScreenWrapperComp backgroundColor={Peach} >
      <ImageWrapper>
        <SocialMediaImage resizeMode='contain' source={require("../../../../assets/SocialMediaPng.png")} ></SocialMediaImage>
      </ImageWrapper>
      <SocialMediaText>Social Media Feed Coming Soon...</SocialMediaText>
      
    </ScreenWrapperComp>
  )
}

export default SocialMediaScreen