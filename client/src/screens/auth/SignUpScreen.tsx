import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import StyledTextInput from "../../components/inputs/StyledTextInput";
import BasicButton from "../../shared/BasicButton";
import { BlueGreen, Peach } from "../../shared/colors";
import ScreenWrapperComp from "../../shared/ScreenWrapperComp";
import { ErrorText } from "../../shared/Styles";
import { AntDesign } from '@expo/vector-icons';
import {
  HeaderTextWrapper,
  HeaderText,
  SubheaderText,
  InputWrapper,
  SmallInfo,
  SubmitButtonWrapper,
  AfterContentContainer,
  SignUpWrapper,
  FooterText,
} from "./SignInScreen";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { AuthContext } from "../../AppContext";
import { checkIfUsernameIsUnique, uploadImageToStorage } from "../../../firebase/FirestoreFunctions";
import ActivityIndicatorWrapper from "../../shared/ActivityIndicatorWrapper";

const ProfileWrapper = styled.View`
  margin-top: 5%;
  align-items: center;
`

const ProfilePhotoWrapper = styled.TouchableOpacity`
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  background-color: #dcd4d4;
  overflow: hidden;
`

const ProfilePicture = styled.Image`
  height: 100%;
  width: 100%;
`

export interface SignUpFormProps {
  userName: string;
  name: string;
  phoneNumber: number;
  profilePhoto: string;
  bio: string;
  email: string;
  password: string;
}
// create an email regex
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const SignUpScreen: FC<any> = ({ navigation }) => {

  const { signUp } = React.useContext(AuthContext);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm<SignUpFormProps>();

  const onSubmit = async (data: SignUpFormProps) => {
    if (!data.profilePhoto) {
      const errorConfig = { type: "manual", message: "A profile photo is required" };
      setError("profilePhoto", errorConfig);
      return
    }
    setIsFirebaseLoading(true)
    const isUserNameOriginal = await checkIfUsernameIsUnique(data.userName)
    setIsFirebaseLoading(false)
    if (!isUserNameOriginal) {
      const errorConfig = { type: "manual", message: "This username is already taken" };
      setError("userName", errorConfig, { shouldFocus: true });
      return
    }
    // console.log(data);
    setIsFirebaseLoading(true)
    const response = await signUp(data)
    // const response = false;
    setIsFirebaseLoading(false)

    if (response) {
      const errorConfig = { type: "manual", message: response };
      setError("password", errorConfig);
    }
  };

  const TOSPress = () => {
    navigation.navigate("TOS");
  };

  const SignInPress = () => {
    navigation.navigate("SignInNav");
  };

  const [profilePicture, setProfilePicture] = React.useState<string | null>(null);

  const handlePickProfilePicture = async () => {

    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
    });
    
    // console.log(result)

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
      setValue("profilePhoto", result.assets[0].uri);
      clearErrors("profilePhoto");
    }
  }
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  // const testingUpload = async () => {
  //   setIsFirebaseLoading(true)
  //   const uuid = "Xx8GcT5r5lWU2mWqWpWbLDCDWUm1"
  //   const dowload = await uploadImageToStorage(uuid, profilePicture || "")
  //   console.log(dowload)
  //   setIsFirebaseLoading(false)
  // }

  return (
    <ScreenWrapperComp scrollView backgroundColor={Peach}>
      <HeaderTextWrapper>
        <HeaderText>Sign Up</HeaderText>
        <SubheaderText>Create an account here</SubheaderText>
      </HeaderTextWrapper>

      <ProfileWrapper>
        <ProfilePhotoWrapper onPress={handlePickProfilePicture}>
          {profilePicture === null ? (
            <AntDesign name="user" size={60} color="#989797" />
          ) : (
            <ProfilePicture source={{uri: profilePicture}} />
          )}
          
        </ProfilePhotoWrapper>
        {errors.profilePhoto && <ErrorText style={{marginTop: "3%"}}>{errors.profilePhoto.message}</ErrorText>}
      </ProfileWrapper>

      <InputWrapper style={{marginTop: "2%"}}>

        <StyledTextInput
          hideText={false}
          error={errors.userName}
          rules={{ required: "This field is required", minLength: { value: 3, message: "Username must be at least 3 characters long" }, maxLength: { value: 15, message: "Username must be less than 15 characters long" } }}
          control={control}
          placeHolderText="User Name"
          name="userName"
          icon="userName"
        />

        <StyledTextInput
          hideText={false}
          error={errors.name}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="Full Name"
          name="name"
          icon="name"
        />

        <StyledTextInput
          hideText={false}
          error={errors.bio}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="Bio"
          name="bio"
          icon="bio"
          otherOptions={{ multiline: true, numberOfLines: 3, style: {alignSelf: "start"} }}
          styles={{ height: 80 }}
        />

        <StyledTextInput
          hideText={false}
          error={errors.phoneNumber}
          rules={{ required: "This field is required" }}
          control={control}
          placeHolderText="Mobile Number"
          name="phoneNumber"
          icon="PhoneNumber"
        />

        <StyledTextInput
          hideText={false}
          error={errors.email}
          rules={{
            required: "This field is required",
            pattern: { value: emailRegex, message: "Not a valid email" },
          }}
          control={control}
          placeHolderText="Email Address"
          name="email"
          icon="email"
        />

        <StyledTextInput
          hideText={true}
          error={errors.password}
          rules={{
            required: "This field is required",
            minLength: { value: 6, message: "Password is too short" },
          }}
          control={control}
          placeHolderText="Password"
          name="password"
          icon="password"
        />
      </InputWrapper>

      <TouchableOpacity style={{width: "85%"}} onPress={TOSPress}>
        <SmallInfo style={{ fontSize: 12, marginTop: "3%" }}>
          By signing up you agree with our Terms of Use
        </SmallInfo>
      </TouchableOpacity>

      <AfterContentContainer>
        <SignUpWrapper>
          <FooterText>Already a member?</FooterText>
          <TouchableOpacity onPress={SignInPress}>
            <FooterText
              style={{ color: BlueGreen, textDecorationLine: "underline" }}
            >
              {" "}
              Sign in
            </FooterText>
          </TouchableOpacity>
        </SignUpWrapper>
      </AfterContentContainer>

      <SubmitButtonWrapper
      style={{marginBottom: "60%"}}>
        <ActivityIndicatorWrapper
          isLoading={isFirebaseLoading}
        >
          <BasicButton
            title="Sign Up"
            style={{ height: 45, width: 295 }}
            onPress={handleSubmit(onSubmit)}
            // onPress={testingUpload}
          />
        </ActivityIndicatorWrapper>
       
      </SubmitButtonWrapper>
    </ScreenWrapperComp>
  );
};

export default SignUpScreen;
