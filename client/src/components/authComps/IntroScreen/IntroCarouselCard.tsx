import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'

const ImageWrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const ImageCard = styled.Image`
  width: 100%;
  height: 100%;
`

interface Props {
  imageSrc: NodeRequire
}

const IntroCarouselCard: FC<Props> = ({
  imageSrc
}) => {
  return (
    <ImageWrapper>
      <ImageCard source={imageSrc as any} />
    </ImageWrapper>
  )
}

export default IntroCarouselCard