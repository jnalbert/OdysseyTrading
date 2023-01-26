import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { FC } from 'react'
import { useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native'
import { AuthContext } from '../../AppContext';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import ActivityIndicatorWrapper from '../../shared/ActivityIndicatorWrapper';
import BasicButton from '../../shared/BasicButton';
import { Black, BlueGreen, GrandstanderSemiBold, MulishMedium, Peach, Text300, Text400 } from '../../shared/colors';
import ScreenWrapperComp from '../../shared/ScreenWrapperComp';

export const HeaderTextWrapper = styled.View`
  margin-top: 10%;
  width: 86%;
  justify-content: flex-start;
  align-items: flex-start;
`

export const HeaderText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-weight: 500;
  font-size: 28px;
  line-height: 33px;
  color: ${Black};
`

export const SubheaderText = styled.Text`
  margin-top: 20px;
  font-family: ${MulishMedium};
  font-size: 15px;
  line-height: 27px;
  color: ${Text300};
`

export const InputWrapper = styled.View`
  margin-top: 10%;
`

export const SmallInfo = styled.Text`
  font-family: ${MulishMedium};
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.2px;
  text-decoration-line: underline;
  color: ${BlueGreen};
  margin-top: 3%;
  text-align: left;
`


export const SubmitButtonWrapper = styled.View`
  margin-top: 4%;
`

export const AfterContentContainer = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  width: 85%;
  margin-top: 2%;
`

export const SignUpWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

`

export const FooterText = styled.Text`
  font-family: ${MulishMedium};
  color: ${Text300};
  font-size: 14px;
  line-height: 27px;
`

export const GuestWrapper = styled.TouchableOpacity`
  width: 85%;
  flex-direction: row;
  justify-content: flex-start; 
  margin-top: 50%;
`

export interface SignInFormProps {
  email: string;
  password: string;
}

const SignInScreen: FC<any> = ({navigation}) => {

  const { signIn, guestSignIn } = React.useContext(AuthContext);
  const [isFirebaseLoading, setIsFirebaseLoading] = React.useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormProps>();

  const onSubmit = async (data: SignInFormProps) => { 
    setIsFirebaseLoading(true)
    // console.log(data);
    const response = await signIn(data)
    // console.log(response)
    setIsFirebaseLoading(false)
   
    if (response) {
      const errorConfig = {type: "manual", message: response}
      setError("password", errorConfig)
    } 
  }

  const forgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }

  const SignUpPress = () => { 
    navigation.navigate('SignUpNav')
  }

  const LoginAsGuest = async () => {
    await guestSignIn()
  }

  
  return (
    <ScreenWrapperComp scrollView backgroundColor={Peach}>
      <HeaderTextWrapper>
        <HeaderText>
          Sign in
        </HeaderText>
        <SubheaderText>
          Welcome back
        </SubheaderText>
      </HeaderTextWrapper>
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

        <StyledTextInput
          hideText={true}
          error={errors.password}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="Password"
          name="password"
          icon="password"
        />
      </InputWrapper>

      <AfterContentContainer>
        <SignUpWrapper>
          <FooterText>New member?</FooterText> 
          <TouchableOpacity onPress={SignUpPress}>
            <FooterText style={{ color: BlueGreen, textDecorationLine: "underline" }}> Sign up</FooterText> 
          </TouchableOpacity>
        </SignUpWrapper>

        <TouchableOpacity onPress={forgotPassword}>
          <SmallInfo>
            Forgot password?
          </SmallInfo>
        </TouchableOpacity>

      </AfterContentContainer>

      <SubmitButtonWrapper>
        <ActivityIndicatorWrapper isLoading={isFirebaseLoading}>
          <BasicButton title="Sign In" style={{height: 45, width: 295}} onPress={handleSubmit(onSubmit)}/>
        </ActivityIndicatorWrapper>
        {/* <CircleButton onPress={handleSubmit(onSubmit)} /> */}
      </SubmitButtonWrapper>

      <GuestWrapper onPress={LoginAsGuest}>
          <SmallInfo>
            Continue as a guest
          </SmallInfo>
        </GuestWrapper>
    </ScreenWrapperComp>
  )
}

export default SignInScreen