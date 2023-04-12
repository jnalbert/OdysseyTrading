import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, View } from 'react-native';
import styled from 'styled-components/native'
import { Peach } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';

const PinLotterySectionWrapper = styled.Pressable`
  height: 80px;
  width: 70px;
  margin: 0% 2% 0% 2%;
`
const PinWrapperComp = styled.View`
 
  height: 80px;
  width: 70px;
`
const PinImage = styled.Image`
  height: 100%;
  width: 100%;
`

interface PinLotterySliderProps {
  pinSrc: string;
  worldIcon: string;
  isShown: boolean;
  flipIndividualPin: (worldIndex: number, pinIndex: number) => void;
  pinIndex: number;
  worldIndex: number;
}

const PinLotterySlider: FC<PinLotterySliderProps> = ({
  pinIndex,
  worldIndex,
  pinSrc,
  worldIcon,
  isShown,
  flipIndividualPin
}) => {

  const flipAnimation = useRef(new Animated.Value(0)).current;

  let flipRotation = 0;
  flipAnimation.addListener(({ value }) => (flipRotation = value));

  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const flipToPinStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  const flipToPin = () => {
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const flipToFront = () => {
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  if (isShown) {
    flipToPin();
  } else {
    flipToFront();
  }

  // const displayOfPin = isShown ? "flex" : "none"
  
  return (
    <PinLotterySectionWrapper onPress={() => !isShown && flipIndividualPin(worldIndex, pinIndex)}>
      <Animated.View
        style={{
          backfaceVisibility: "hidden",
          width: 80,
          height: 70,
          ...flipToFrontStyle,
        }}
      >
        <MyCachedImage style={{height: "100%", width: "100%"}} resizeMode="contain" src={worldIcon} />
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
          width: 80,
          height: 70,
          ...flipToPinStyle,
        }}
      >
        <MyCachedImage style={{height: "100%", width: "100%"}} resizeMode="contain" src={pinSrc} />
      </Animated.View>
      {/* <Animated.Image
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
          width: 80,
          height: 70,
          resizeMode: "contain",
          ...flipToPinStyle,
        }}
        source={{ uri: pinSrc }}
        
      />
      <Animated.Image
        style={{
          backfaceVisibility: "hidden",
          width: 80,
          height: 70,
          ...flipToFrontStyle,
          resizeMode: "contain",
        }}
        source={{uri: worldIcon}}
      /> */}
      {/* <Animated.View style={{ opacity: fadeInPin, position: "absolute"}}>
        {pickedPinState && (
          <PinWrapperComp>
            <PinImage resizeMode="contain" source={{uri: pickedPin.src}} />
          </PinWrapperComp>
        )}
        
      </Animated.View> */}
    </PinLotterySectionWrapper>
  )
}

export default PinLotterySlider