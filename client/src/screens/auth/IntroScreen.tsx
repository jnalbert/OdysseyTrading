import React, { FC } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { Peach } from "../../shared/colors";
import ScreenWrapperComp from "../../shared/ScreenWrapperComp";

const IntroScreenWrapper = styled.View`
  margin-top: 12%;
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const IntroImage = styled.Image`
  width: 100%;
`;

const IntroScreen: FC = () => {
  return (
    <ScreenWrapperComp noMargin backgroundColor={Peach}>
      <IntroScreenWrapper>
        <IntroImage source={require("/Users/justinalbert/Code_Projects/CurrentProjects/OdysseyTrading/client/assets/OdysseyAppIntro.png")} />
      </IntroScreenWrapper>
    </ScreenWrapperComp>
  );
};

export default IntroScreen;
