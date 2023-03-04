import React, { FC, useEffect, useState } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import Carousel from "react-native-reanimated-carousel";
import { BlueGreen, GrandstanderMedium, GrandstanderSemiBold, Peach, Pink } from "../../../shared/colors";
import MyCachedImage from '../../../shared/MyCachedImage';
import { getAllPins } from "../../../../firebase/FirestoreFunctions";
import { PinTypeDB } from '../../../../firebase/types/PinAndWorldType';

const OverallWrapper = styled.View`
  flex-direction: column;
  align-items: center;
`;
const PinsContainer = styled.View`
  height: 280px;
  width: 60%;
  justify-content: center;
  align-items: center;
  background-color: ${BlueGreen};
  border-top-left-radius: 100%;
  border-top-right-radius: 100%;
  border: 2.5px solid black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const PinImageWrapper = styled.View`
  margin-top: 25%;
  height: 75%;
  /* width: 170px; */
`;


const PinLabelWrapper = styled.View`
  margin-top: 5%;
  width: 60%;
  height: 45px;
  background-color: ${Pink};
  justify-content: center;
  align-items: center;
  border: 1.5px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const PinLabel = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 22px;
  color: ${Peach};
`;


const DisplayPinSlider: FC = () => {
  const [pinsData, setPinsData] = useState<PinTypeDB[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>("");

  const getPinsData = async () => {
    // fetch pins from firebase server
    const allPinsData = await getAllPins()
    setPinsData(allPinsData || []);
  };
  useEffect(() => {
    getPinsData();
  }, []);

  const handlePinLabel = (label: string) => {
    setCurrentLabel(label);
  };

  return (
    <OverallWrapper>
      <PinsContainer>
        <Carousel
          loop
          width={170}
          // height={350}
          autoPlay={true}
          autoPlayInterval={1000}
          data={pinsData}
          scrollAnimationDuration={300}
          overscrollEnabled={true}
          onSnapToItem={(index) => {
            handlePinLabel(pinsData[index].worldName);
          }}
          renderItem={(pin) => (
            <PinImageWrapper>
              <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={pin.item.src} />
            </PinImageWrapper>
          )}
        />
      </PinsContainer>

      <PinLabelWrapper>
        <PinLabel>{currentLabel}</PinLabel>
      </PinLabelWrapper>
    </OverallWrapper>
  );
};

export default DisplayPinSlider;
