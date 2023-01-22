import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { GrandstanderSemiBold, Pink } from '../../../shared/colors';

const OverallCardWrapper = styled.View`
  width: 48%;
  /* margin: 1%; */
  height: 125px;
  /* align-items: center; */
  justify-content: center;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const PinImageWrapper = styled.View`
  height: 85%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const PinImage = styled.Image`
  height: 100%;
  width: 100%;
`;

const DuplicateWrapper = styled.View`
  position: absolute;
  top: 5px;
  right: 5px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: ${Pink};
  justify-content: center;
  align-items: center;
`

const DuplicateText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 14px;
  color: #ffffff;
`

interface Props {
  src: string;
  isHidden: boolean;
  color: string;
  numberOfDuplicates: number;
  style: {};
}

const CollectionPinCard: FC<Props> = ({
  src,
  isHidden,
  color,
  style,
  numberOfDuplicates
}) => {
  const tintColor = isHidden ? {tintColor: "rgba(0, 0, 0, 0.3)"} : {}
  return (
    <OverallCardWrapper style={[{backgroundColor: color}, style]}>
      <PinImageWrapper>
        <PinImage style={[tintColor]} resizeMode='contain' source={{uri: src}} />
      </PinImageWrapper>
      {numberOfDuplicates > 1 && (
        <DuplicateWrapper>
          <DuplicateText>{numberOfDuplicates}x</DuplicateText>
        </DuplicateWrapper>
      )}
      
    </OverallCardWrapper>
  )
}

export default CollectionPinCard