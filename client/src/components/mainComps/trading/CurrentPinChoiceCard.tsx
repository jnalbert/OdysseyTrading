import React, { FC } from 'react'
import { View, Image } from 'react-native';
import styled from 'styled-components/native'
import { backgroundColor, borderColor, Pink } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';

const OverallWrapper = styled.View`
  width: 33%;
  height: 100%;
  border-radius: 20px;
  border-width: 3px;
  background-color: red;
  justify-content: center;
  align-items: center;
`

const PinWrapper = styled.View`
  width: 90%;
  height: 90%;
`

interface Props {
  pinSrc: string;
  isConfirmed: boolean
}

const CurrentPinChoiceCard: FC<Props> = ({
  pinSrc,
  isConfirmed
}) => {
  // console.log("receive PinSrc: ", pinSrc)
  const confirmedStyles = isConfirmed ? {
    borderColor: '#2DDB29',
    backgroundColor: "#2cdb297f",
    // opacity: 0.5
  } : {
    borderColor: Pink,
    backgroundColor: "#f56d6d7f",
    // opacity: 0.5
  }
  return (
    <OverallWrapper style={[confirmedStyles, {borderWidth: 3}]}>
      <PinWrapper> 
        { pinSrc && (
          <Image style={{width: "100%", height: "100%"}} resizeMode={"contain"} source={{uri: pinSrc}} />
        )}

      </PinWrapper>
    </OverallWrapper>
  )
}

export default CurrentPinChoiceCard