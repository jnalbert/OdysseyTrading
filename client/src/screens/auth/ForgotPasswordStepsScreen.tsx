import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import StepSection, { StepsSectionProps } from '../../components/authComps/signInComps/StepSection';
import BasicButton from '../../shared/BasicButton';
import { GrandstanderSemiBold, Pink } from '../../shared/colors';
import ScreenWrapperComp from '../../shared/ScreenWrapperComp';
import { SubmitButtonWrapper } from './ForgotPasswordScreen';

const HeaderTextWrapper = styled.View`
  margin-top: 8%;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const HeaderText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 22px;
  line-height: 33px;
  color: ${Pink};
` 

const StepsWrapper = styled.View`
  margin-top: 2%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StepTexts: StepsSectionProps[] = [
  {
    step: 1,
    body: "Visit your email and find the one from Odyssey"
  },
  {
    step: 2,
    body: "Click the link in the email and you will be redirected to a website to change your password"
  },
  {
    step: 3,
    body: "Your Almost there! Just go back to the app and login with your new password"
  }
]
 

const ForgotPasswordStepsScreen: FC = () => {

  const navigation: any = useNavigation()
  const OnButtonClick = () => {
    navigation.navigate('SignIn')
  }
  
  return (
    <ScreenWrapperComp scrollView>
      <HeaderTextWrapper>
        <HeaderText>Forgot Password Successful</HeaderText>
      </HeaderTextWrapper>
      <StepsWrapper>
        {StepTexts.map(({ step, body }: StepsSectionProps, index) => { 
          return <StepSection key={index} step={step} body={body} />
        })}
      </StepsWrapper>

      <SubmitButtonWrapper>
          <BasicButton style={{height: 45, width: 150 }} title='Continue' onPress={OnButtonClick} />
      </SubmitButtonWrapper>
    </ScreenWrapperComp>
  )
}

export default ForgotPasswordStepsScreen