import React, { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const SpinnerWrapper = styled.View`
  justify-content: center;
  align-items: center;
`

interface Props {
  isLoading: boolean;
  children: JSX.Element;
}

const IsLoadingComp: FC<Props> = ({isLoading, children}) => {
  return (
    <>
      {
        isLoading ?
          <SpinnerWrapper>
            <ActivityIndicator size="large"  />
          </SpinnerWrapper> :

          <>{children}</>
      }
    </>
  )
}

export default IsLoadingComp