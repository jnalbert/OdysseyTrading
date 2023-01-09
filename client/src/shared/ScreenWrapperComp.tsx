import React, { FC, useState } from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { isAnonymous } from '../AppContext';
import { backgroundColor } from "./colors";
import IsProtectedComp from "./IsProtectedComp";

const ScreenWrapper = styled.View`
  flex: 1;
  background-color: ${backgroundColor};
  flex-direction: column;
  align-items: center;
  margin: 0px 24px;
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
}

const ScreenWrapperComp: FC<ScreenWrapperCompProps> = ({
  children,
  scrollView,
  refreshControl,
  isScreenProtected
}) => {

  const [isProtected, setIsProtected] = useState(false);

  const checkUser = async () => {
    const isAnonymousRes = await isAnonymous();
    setIsProtected(isAnonymousRes as any);
  }

  if (isScreenProtected) {
    checkUser()
  }

  return (

    <ScreenBackgroundColor>
      {isProtected ? (
        <IsProtectedComp/>
      ): (
          <>
             {scrollView ? (
                <ScrollView refreshControl={refreshControl}>
                  <ScreenWrapper>{children}</ScreenWrapper>
                </ScrollView>
              ) : (
                <ScreenWrapper>{children}</ScreenWrapper>
              )}
          </>
      )
    }
      
     
    </ScreenBackgroundColor>
  );
};

export default ScreenWrapperComp;
