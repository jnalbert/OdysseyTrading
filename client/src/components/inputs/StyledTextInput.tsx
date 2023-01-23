import React, { FC, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { Controller } from "react-hook-form";
import { ErrorText } from "../../shared/Styles";
import { borderColor, MulishMedium, Text300 } from "../../shared/colors";
import ShowHideButton from "./ShowHideButton";


import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 


const TextInputWrapper = styled.View`
  width: 85%;
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
  height: 50px;
  margin: 4% 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${borderColor};
`;

const IconWrapper = styled.View`
  border-right-width: 1px;
  border-right-color: ${borderColor};
  height: 75%;
  justify-content: center;
  padding-right: 8px;
`;

const TextInputStyled = styled.TextInput`
  width: 100%;
  padding-left: 20px;
  font-family: ${MulishMedium};
  height: auto;
  max-width: 100%;
  flex: 1;
  font-size: 16px;
  /* align-self: start; */
`;

interface Props {
  control: any;
  placeHolderText: string;
  rules: any;
  name: string;
  error: any;
  hideText: boolean | undefined;
  styles?: {};
  otherOptions?: {};
  icon: "email" | "password" | "name" | "PhoneNumber" | "bio" | "userName";
}

const StyledTextInput: FC<Props> = ({
  control,
  placeHolderText,
  rules,
  name,
  error,
  hideText,
  styles,
  otherOptions,
  icon,
}) => {
  const [secureTextEntryValue, setSecureTextEntryValue] = useState(hideText);

  const showHideText = () => {
    setSecureTextEntryValue(!secureTextEntryValue);
  };

  const renderIcon = () => {
    if (icon === "email")
        return <MaterialCommunityIcons name="email-outline" size={20} color="#001833" />
    if (icon === "password")
      return <AntDesign name="lock" size={24} color="#001833" />;
    if (icon === "name")
      return <AntDesign name="idcard" size={20} color="#001833" />
    if (icon === "PhoneNumber")
      return <Ionicons name="phone-portrait-outline" size={20} color="#001833" />;
    if (icon === "bio") 
      return <FontAwesome name="paper-plane-o" size={20} color="#001833" />;
    if (icon === "userName")
      return <FontAwesome name="user-o" size={20} color="#001833" />;
  };

  return (
    <>
      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <TextInputWrapper style={styles}>
              <IconWrapper>{renderIcon()}</IconWrapper>

              <TextInputStyled
                {...otherOptions}
                placeholder={placeHolderText}
                placeholderTextColor={Text300}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={secureTextEntryValue}
              />

              {hideText && <ShowHideButton onPress={showHideText} />}
            </TextInputWrapper>
          );
        }}
      />

      {error && <ErrorText>{error.message}</ErrorText>}
    </>
  );
};

export default StyledTextInput;
