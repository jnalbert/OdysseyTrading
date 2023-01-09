import React, { FC, useContext } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import BasicButton from './BasicButton';
import { Black, GrandstanderExtraBold, MulishMedium } from './colors';
import { AuthContext } from '../AppContext';

const OverallWrapper = styled.View`
  height: 100%;
  width: 100%;
  padding-top: 37%;
  alignItems: center;
`

const HeaderText = styled.Text`
  font-family: ${GrandstanderExtraBold};
  color: ${Black};
  font-size: 35px;
  line-height: 48px;
  letter-spacing: -1.5px;
  text-align: center;
`

const SubHeaderWrapper = styled.View`
  width: 75%;
`

const SubHeaderText = styled.Text`
  margin-top: 28px;
  font-family: ${MulishMedium};
  color: ${Black};
  font-size: 27px;
  line-height: 40px;
  /* or 148% */

  text-align: center;
  letter-spacing: -1.5px;
`

const ButtonWrapper = styled.View`
  margin-top: 5%;
  width: 80%;
  align-self: center;
`


const IsProtectedComp: FC = () => {

  const { signOut } = useContext(AuthContext);

  const signOutPress = () => {
    signOut()
  }

  return (
    <OverallWrapper>

      <HeaderText>You must be signed in</HeaderText>
      <SubHeaderWrapper>
        <SubHeaderText>
          This page requires an account 
        </SubHeaderText>

        <SubHeaderText style={{fontSize: 24}}>
          Please create one or sign in
        </SubHeaderText>
      </SubHeaderWrapper>

      <ButtonWrapper>
        <BasicButton title="Sign In" onPress={signOutPress} style={{ width: "100%", height: 50, backgroundColor: "transparent" }} buttonTextStyle={{fontSize: 18}} gradient />
        </ButtonWrapper>
    </OverallWrapper>
  )
}

export default IsProtectedComp