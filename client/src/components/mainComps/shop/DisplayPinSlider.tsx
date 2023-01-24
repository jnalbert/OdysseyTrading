import React, { FC, useEffect, useState } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import Carousel from "react-native-reanimated-carousel";
import { BlueGreen, GrandstanderMedium, GrandstanderSemiBold, Peach, Pink } from "../../../shared/colors";
import MyCachedImage from '../../../shared/MyCachedImage';

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

interface PinDataType {
  src: string;
  world: string;
}

const pinsRawData = [
  {
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frank%20traveling.png?alt=media&token=57a5f1c5-9bb9-4a8f-9f16-ff60ef19fdaf",
    world: "Enchanted Forest",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20in%20a%20flower.png?alt=media&token=5dc21ba1-0c99-4c71-a5f8-ee7e332ea68f",
    world: "Enchanted Forest",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/buff%20bunny%20ft.%20sleepy%20shroom.png?alt=media&token=0076d12f-7b39-4e29-9edc-87a3e71b3d95",
    world: "Enchanted Forest",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frankie%20petting%20wolf.png?alt=media&token=7f51fc18-053f-4718-a79b-115bcbf67969",
    world: "Enchanted Forest",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pang%20with%20leaf%20umbrella.png?alt=media&token=bafd86cc-0223-4e52-bcdf-a9e7a0ce1492",
    world: "Enchanted Forest",
  },
  {
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73",
    world: "Deep Sea",
  },
];

const DisplayPinSlider: FC = () => {
  const [pinsData, setPinsData] = useState<PinDataType[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>("");

  const getPinsData = async () => {
    // fetch pins from firebase server
    setPinsData(pinsRawData);
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
            handlePinLabel(pinsData[index].world);
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
