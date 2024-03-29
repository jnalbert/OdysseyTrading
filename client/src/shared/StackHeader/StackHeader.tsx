import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { GrandstanderSemiBold, Peach } from '../colors';

const HeaderContainer = styled.View`
  height: 88px;
  padding-top: 35px;
  justify-content: center;
  align-items: center;

  background-color: ${Peach};
`

const HeaderText = styled.Text`
  font-size: 20px;
  font-family: ${GrandstanderSemiBold};
  /* line-height: 28px; */
  text-align: center;
  /* letter-spacing: -1px; */
`

interface StackHeaderProps {
  name: string;
}

const StackHeader: FC<StackHeaderProps> = ({name}) => {
  return (
    <HeaderContainer>
      <HeaderText>{name}</HeaderText> 
    </HeaderContainer>
  )
}

export default StackHeader