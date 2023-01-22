import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import styled from 'styled-components/native'
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import { HeaderText, HeaderTextWrapper, InputWrapper, SubheaderText } from '../../auth/SignInScreen';
import StyledTextInput from '../../../components/inputs/StyledTextInput';
import BasicButton from '../../../shared/BasicButton';
import ActionCompletedSection from '../../../shared/ActionCompletedSection';
import { Orange, Peach } from '../../../shared/colors';

export interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordButtonWrapper = styled.View`
  margin-top: 5%;
  width: 50%;
`

const ChangePasswordScreen: FC<any> = ({navigation}) => {

  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors
  } = useForm<ChangePasswordFormProps>();

  const onSubmit = async (data: ChangePasswordFormProps) => {
    // console.log(data)
    // TODO IMPLEMENT THIS ***************
    // const res = await ChangePassword(data.newPassword)
    const res = ""
    if (res) {
      console.log(res)
    } else {
      setIsSubmitted(true);
    }
  };

  const handleResetPress = async () => {
    const {oldPassword, newPassword, confirmPassword} = getValues();

    // call function to validate password here instead of hard code
    // TODO IMPLEMENT THIS ***************
    // const res = await ReauthenticateUser(oldPassword);
    const res: any = ""

    if (res === "wrongPass") {
      setError("oldPassword", { type: "manual", message: "Incorrect Password" })
      
    }
    else if (newPassword !== confirmPassword) {

      const errorConfig = {type: "manual", message: "Passwords do not match"}
      setError("newPassword", errorConfig)
      setError("confirmPassword", errorConfig)

    } else {
      handleSubmit(onSubmit)()
    }
  }
  
  useEffect(() => {
    // console.log("worked")
    clearErrors("oldPassword")
  }, [getValues("oldPassword")])

  const goBackToSettings = () => {
    navigation.navigate("Profile", {screen: "Profile"})
  }

  return (
    <>
      {isSubmitted && <ActionCompletedSection visible={isSubmitted} title="Password Changed" subheading={"Your password has successfully been changed"} buttonTitle="Return To Settings" buttonOnPress={goBackToSettings} />}
    <ScreenWrapperComp scrollView noMargin>
      <HeaderTextWrapper>
        <HeaderText>
          Change Your Password
        </HeaderText>
        <SubheaderText>
          Forgot you password? No worries!
        </SubheaderText>
      </HeaderTextWrapper>

      <InputWrapper>
        <StyledTextInput
          hideText={true}
          error={errors.oldPassword}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="Old Password"
          name="oldPassword"
          icon="password"
        />

        <StyledTextInput
          hideText={true}
          error={errors.newPassword}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="New Password"
          name="newPassword"
          icon="password"
          />
          
          <StyledTextInput
          hideText={true}
          error={errors.confirmPassword}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="Confirm Password"
          name="confirmPassword"
          icon="password"
        />
      </InputWrapper>

      <ChangePasswordButtonWrapper>
        <BasicButton style={{width: "100%", borderRadius: 18, backgroundColor: Orange, borderColor: "black", borderWidth: 2}} buttonTextStyle={{color: Peach, fontSize: 18}} onPress={handleResetPress} title='Change Password' />
      </ChangePasswordButtonWrapper>

    </ScreenWrapperComp>
    </>
  )
}

export default ChangePasswordScreen