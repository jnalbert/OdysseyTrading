import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'

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

interface Props {
  src: string;
  isHidden: boolean;
  color: string;
  style: {};
}

const CollectionPinCard: FC<Props> = ({
  src,
  isHidden,
  color,
  style
}) => {
  const tintColor = isHidden ? {tintColor: "rgba(0, 0, 0, 0.3)"} : {}
  return (
    <OverallCardWrapper style={[{backgroundColor: color}, style]}>
      <PinImageWrapper>
        <PinImage style={[tintColor]} resizeMode='contain' source={{uri: src}} />
      </PinImageWrapper>
    </OverallCardWrapper>
  )
}

export default CollectionPinCard