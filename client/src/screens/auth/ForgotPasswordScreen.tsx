import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import styled from 'styled-components/native'
import { resetPassword } from '../../AppContext';
import ScreenWrapperComp from '../../shared/ScreenWrapperComp';
import { HeaderText, SubheaderText } from './SignInScreen';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import BasicButton from '../../shared/BasicButton';

const HeaderTextWrapper = styled.View`
  margin-top: 20%;
  width: 95%;
  justify-content: flex-start;
  align-items: flex-start;
`

const InputWrapper = styled.View`
  margin-top: 9%;
  padding-left: 8px;
  width: 106%;
` 

export const SubmitButtonWrapper = styled.View`
  width: 100%;
  margin-top: 20%;
  justify-content: center;
  align-items: flex-end;
  margin-right: 35px; 
`

interface ForgotPasswordForm {
  email: string;
  password: string;
}

const ForgotPasswordScreen: FC = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordForm>();

  const navigation: any = useNavigation()
  
  const onSubmit = async (data: ForgotPasswordForm) => { 
    console.log(data);
  
    const response = await resetPassword(data.email);
    // const response = null;
   
    console.log('first', response)
    if (response) {
      const errorConfig = {type: "manual", message: response}
      setError("email", errorConfig)
    } else {
      navigation.navigate('ForgotPasswordSteps')
    } 
  }

  return (
    <ScreenWrapperComp>
      <HeaderTextWrapper>
        <HeaderText>Forgot Password?</HeaderText>
        <SubheaderText>Enter your email address</SubheaderText>

        <InputWrapper>
          <StyledTextInput
            hideText={false}
            error={errors.email}
            rules={{ required: "This field is required" }}
            control={control}
            placeHolderText="Email Address"
            name="email"
            icon="email"
          />
        </InputWrapper>

      
        <SubmitButtonWrapper>
          <BasicButton style={{height: 45, width: 150 }} title='Continue' onPress={handleSubmit(onSubmit)} />
        </SubmitButtonWrapper>
      </HeaderTextWrapper>
    </ScreenWrapperComp>
  )
}

export default ForgotPasswordScreen