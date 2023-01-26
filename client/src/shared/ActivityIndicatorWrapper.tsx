import React, { FC } from 'react'
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native'

interface Props {
  children: React.ReactNode;
  isLoading: boolean;
}

const ActivityIndicatorWrapper: FC<Props> = ({
  isLoading,
  children,
}) => {

  return (
    <>
    {isLoading ? (
      <ActivityIndicator 
        style={{alignSelf: 'center', marginTop: 20}}
      size="small" color="#0000ff" />
    ) : (
      <>
        {children}
      </>
    )}
    
    </>
  )
}

export default ActivityIndicatorWrapper