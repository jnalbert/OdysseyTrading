import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const HeaderContainer = styled.View`
  height: 88px;
  padding-top: 35px;
 
`

const HeaderText = styled.Text`
  font-size: 20px;
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