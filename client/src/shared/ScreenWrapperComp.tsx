import React, { FC, useState } from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { isAnonymous } from '../AppContext';
import { backgroundColor } from './colors';
import IsProtectedComp from "./IsProtectedComp";

const ScreenWrapper = styled.View`
  flex: 1;
  background-color: ${backgroundColor};
  flex-direction: column;
  align-items: center;
  margin: 0px 20px;
`;

const ScreenBackgroundColor = styled.View`
  background-color: ${backgroundColor};
  flex: 1;
`;

interface ScreenWrapperCompProps {
  children: React.ReactNode;
  scrollView?: boolean;
  refreshControl?: any;
  isScreenProtected?: boolean;
  noMargin?: boolean;
  backgroundColor?: string;
}

const ScreenWrapperComp: FC<ScreenWrapperCompProps> = ({
  children,
  scrollView,
  refreshControl,
  isScreenProtected,
  noMargin,
  backgroundColor
}) => {

  const [isProtected, setIsProtected] = useState(false);

  const checkUser = async () => {
    const isAnonymousRes = await isAnonymous();
    setIsProtected(isAnonymousRes as any);
  }

  if (isScreenProtected) {
    checkUser()
  }

  const noMarginStyle = noMargin ? {marginLeft: 0, marginRight: 0} : {};
  const backgroundColorStyle = backgroundColor ? {backgroundColor: backgroundColor} : {};

  return (

    <ScreenBackgroundColor style={[backgroundColorStyle]}>
      {isProtected ? (
        <IsProtectedComp/>
      ): (
          <>
             {scrollView ? (
                <ScrollView refreshControl={refreshControl}>
                  <ScreenWrapper style={[noMarginStyle, backgroundColorStyle]}>{children}</ScreenWrapper>
                </ScrollView>
              ) : (
                <ScreenWrapper style={[noMarginStyle, backgroundColorStyle]}>{children}</ScreenWrapper>
              )}
          </>
      )
    }
      
     
    </ScreenBackgroundColor>
  );
};

export default ScreenWrapperComp;
