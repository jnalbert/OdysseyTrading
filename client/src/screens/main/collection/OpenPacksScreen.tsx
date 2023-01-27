import React, { FC, useRef, useState, useEffect } from "react";
import { Animated, View } from "react-native";
import styled from "styled-components/native";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";
import BasicButton from "../../../shared/BasicButton";
import { BlueGreen, Orange, Peach, Pink } from "../../../shared/colors";
import WorldPackSection from "../../../components/mainComps/openPacks/WorldPackSection";
import { _getUuid } from "../../../AppContext";
import { addPinsToUserCollection, getPacksToOpenData } from "../../../../firebase/FirestoreFunctions";
import { PinTypeDB } from "../../../../firebase/types/PinAndWorldType";
import ActivityIndicatorWrapper from "../../../shared/ActivityIndicatorWrapper";

const TopButtonWrapper = styled.View`
  width: 90%;
  margin-top: 3%;
`;

const PinsToOpenWrapper = styled.View`
  width: 100%;
`;

const FakePinDeepSea = [
  {
    world: "Deep Sea",
    uuid: "1",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73",
  },
  {
    world: "Deep Sea",
    uuid: "2",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20in%20a%20flower.png?alt=media&token=5dc21ba1-0c99-4c71-a5f8-ee7e332ea68f",
  },
  // {
  //   world: "Deep Sea",
  //   uuid: "3",
  //   src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/DeepSeaIcon.png?alt=media&token=22bb8fdb-e4f2-40d9-a9f9-f7accbcb6b8e",
  // },
];

// const FakePinEnchantedForest = [
//   {
//     world: "Enchanted Forest",
//     uuid: "1",
//     src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/buff%20bunny%20ft.%20sleepy%20shroom.png?alt=media&token=0076d12f-7b39-4e29-9edc-87a3e71b3d95",
//   },
//   {
//     world: "Enchanted Forest",
//     uuid: "2",
//     src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frank%20traveling.png?alt=media&token=57a5f1c5-9bb9-4a8f-9f16-ff60ef19fdaf",
//   },
//   {
//     world: "Enchanted Forest",
//     uuid: "3",
//     src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frankie%20petting%20wolf.png?alt=media&token=e673b94a-777a-4337-a052-3531c7e737ae",
//   },
// ];

// const FakeWorldData: WorldPinsToOpenType[] = [
//   {
//     world: "Deep Sea",
//     worldIcon:
//       "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/DeepSeaIcon.png?alt=media&token=22bb8fdb-e4f2-40d9-a9f9-f7accbcb6b8e",
//     color: BlueGreen,
//     pickedPins: FakePinDeepSea,
//   },
//   {
//     world: "Enchanted Forest",
//     color: "#6b9247",
//     worldIcon:
//       "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/TreeLandIcon.png?alt=media&token=97a786f4-9016-4a66-b9b8-b4590b4be6cf",
//     pickedPins: FakePinEnchantedForest,
//   },
// ];

export interface WorldPinsToOpenType {
  world: string;
  color: string;
  worldIcon: string;
  pickedPins: PinTypeDB[];
}

const OpenPacksScreen: FC<any> = ({ navigation }) => {
  const [pinsAreOpen, setPinsAreOpen] = useState<boolean>(false);
  const [backToHomeDisabled, setBackToHomeDisabled] = useState<boolean>(true);
  const [worldPinsToOpen, setWorldPinsToOpen] =
    useState<WorldPinsToOpenType[]>();
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(false);

  const getWorldPinsToOpenData = async () => {
    // get data from the server
    // TODODO ********
    setIsFirebaseLoading(true);
    const userUuid = await _getUuid()
    const packsToOpen = await getPacksToOpenData(userUuid || "")
    // console.log(packsToOpen)
    // // const response = FakeWorldData;
    setWorldPinsToOpen(packsToOpen);
    setIsFirebaseLoading(false);
    // add pins to the user collection
    // get all of the pins in an array
    const pinsToAdd: PinTypeDB[] = []
    packsToOpen?.forEach((world) => {
      world.pickedPins.forEach((pin) => {
        pinsToAdd.push(pin)
      })
    })
    // add pins to the user collection
    await addPinsToUserCollection(userUuid || "", pinsToAdd)
  };

  useEffect(() => {
    getWorldPinsToOpenData();
  }, []);

  const handleOpenPacks = async () => {
    setPinsAreOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setBackToHomeDisabled(false);
  };

  const goBackHome = () => {
    // TODO SEND DATA ABOUT PINS TO SERVER ********
    navigation.navigate("MyCollection", { screen: "MyCollection" });
  };

  return (
    <ScreenWrapperComp scrollView>
      <TopButtonWrapper>
        {pinsAreOpen ? (
          <BasicButton
            style={{
              width: "100%",
              borderRadius: 18,
              backgroundColor: Pink,
              height: 56,
            }}
            isDisabled={backToHomeDisabled}
            buttonTextStyle={{ color: Peach, fontSize: 28 }}
            onPress={goBackHome}
            title="Back Home"
          />
        ) : (
          <BasicButton
            style={{
              width: "100%",
              borderRadius: 18,
              backgroundColor: Orange,
              borderColor: "black",
              borderWidth: 2,
              height: 56,
            }}
            isDisabled={pinsAreOpen}
            buttonTextStyle={{ color: Peach, fontSize: 28 }}
            onPress={handleOpenPacks}
            title="Open All Packs"
          />
        )}
      </TopButtonWrapper>
      <ActivityIndicatorWrapper isLoading={isFirebaseLoading}>
        <PinsToOpenWrapper>
          {worldPinsToOpen?.map((world, index) => {
            return <WorldPackSection isShown={pinsAreOpen} key={index} {...world} />;
          })}
        </PinsToOpenWrapper>
      </ActivityIndicatorWrapper>
    </ScreenWrapperComp>
  );
};

export default OpenPacksScreen;
