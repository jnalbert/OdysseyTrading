import React, { FC, useState, useEffect } from "react";
import { View, Text, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import CollectionPercent from "../../../components/mainComps/collection/CollectionPercent";
import CollectionPinCard from "../../../components/mainComps/collection/CollectionPinCard";
import StackHeaderNotifications from "../../../components/mainComps/collection/StackHeaderNotifcations";
import WorldSelector from "../../../components/mainComps/collection/WorldSelector";
import {
  BlueGreen,
  GrandstanderSemiBold,
  Peach,
} from "../../../shared/colors";
import { WorldNameEnum } from "../../../shared/MiscTypes";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";

const PinsCollectedPercentSlider = styled.View`
  margin-top: 3%;
  width: 95%;
`;
const Divider = styled.View`
  width: 95%;
  border: 0.75px solid black;
  margin-top: 5%;
  margin-bottom: 5%;
  background-color: black;
`;

const WorldPickingWrapper = styled.View`
  position: absolute;
  bottom: 0;
  height: 12.3%;
  /* justify-content: center; */
  align-items: center;
  /* width: 100%; */
  /* height: 40px;
  width: 40px; */
  /* background-color: ${BlueGreen}; */
`;

const ComingSoonText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 24px;
  color: ${BlueGreen};
`;
const ShhhEmoji = styled.Text`
  font-size: 96px;
  text-align: center;
`;

const FakeWorldData: WorldsAttributesType = {
  [WorldNameEnum.DEEP_SEA]: {
    worldName: "Deep Sea",
    worldColor: "#5FB5BF",
    worldIcon:
      "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/DeepSeaIcon.png?alt=media&token=22bb8fdb-e4f2-40d9-a9f9-f7accbcb6b8e",
    pinsInWorld: 13,
    pinsCollected: 5,
  },
  [WorldNameEnum.ENCHANTED_FOREST]: {
    worldName: "Enchanted Forest",
    worldColor: "#6b9247",
    worldIcon:
      "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/TreeLandIcon.png?alt=media&token=97a786f4-9016-4a66-b9b8-b4590b4be6cf",
    pinsInWorld: 22,
    pinsCollected: 22,
  },
};

const FakePinData: PinsData = {
  [WorldNameEnum.DEEP_SEA]: [
    {
      id: "123234",
      name: "Pang Searching For Home",
      world: "Deep Sea",
      worldColor: "#5FB5BF",
      duplicates: 1,
      fullColorSrc:
        "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73",
      isOwned: false,
    },
    {
      id: "123233s4",
      name: "Pang Searching For Home",
      world: "Deep Sea",
      worldColor: "#5FB5BF",
      duplicates: 2,
      fullColorSrc:
        "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73",
      isOwned: true,
    },
    {
      id: "123233s4",
      name: "Pang Searching For Home",
      world: "Deep Sea",
      worldColor: "#5FB5BF",
      duplicates: 1,
      fullColorSrc:
        "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73",
      isOwned: false,
    },
  ],
  [WorldNameEnum.ENCHANTED_FOREST]: [
    {
      id: "12323sdfsd4",
      name: "Frank Traveling",
      world: "Enchanted Forest",
      worldColor: "#6b9247",
      duplicates: 1,
      fullColorSrc:
        "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frank%20traveling.png?alt=media&token=57a5f1c5-9bb9-4a8f-9f16-ff60ef19fdaf",
      isOwned: false,
    },
    {
      id: "12323sdfsd4",
      name: "Pang In A Flower",
      world: "Enchanted Forest",
      worldColor: "#6b9247",
      duplicates: 5,
      fullColorSrc:
        "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20in%20a%20flower.png?alt=media&token=3b2b2b1f-5b1f-4b1f-9f16-ff60ef19fdaf",
      isOwned: true,
    },
  ],
};

interface PinType {
  id: string;
  name: string;
  world: string;
  worldColor: string;
  fullColorSrc: string;
  duplicates: number;
  isOwned: boolean;
}

export interface WorldType {
  worldName: string;
  worldColor: string;
  worldIcon: string;
  pinsInWorld: number;
  pinsCollected: number;
}

// make a type script type that is an object with string keys and PinType values
type PinsData = { [key in WorldNameEnum]?: PinType[] };

export type WorldsAttributesType = { [key in WorldNameEnum]?: WorldType };

const MyCollectionScreen: FC<any> = ({navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [pinsData, setAllPinsData] = useState<PinsData>();
  const [worldAttributes, setWorldAttributes] =
    useState<WorldsAttributesType>();
  const [currentWorld, setCurrentWorld] = useState<WorldNameEnum>();

  const getPinData = async () => {
    // fetch data from server
    // setAllPinsData(data)

    // sort all of the pins as it comes in by te isOwned property
    // loop through fake data and sort it
    Object.keys(FakePinData).forEach((world) => {
      FakePinData[world as WorldNameEnum] = FakePinData[
        world as WorldNameEnum
      ]?.sort((a, b) => {
        if (a.isOwned && !b.isOwned) {
          return -1;
        } else if (!a.isOwned && b.isOwned) {
          return 1;
        } else {
          return 0;
        }
      });
      // set the coming soon world to an empty array
      FakePinData[WorldNameEnum.COMING_SOON] = [];
      // duplication of data for testing purposes
      // const Data: any = FakePinData[world as WorldNameEnum]
      // FakePinData[world as WorldNameEnum] = [...Data, ...Data, ...Data, ...Data, ...Data]
    });

    setAllPinsData(FakePinData);
  };

  const getWorldAttributes = async () => {
    // fetch data from server
    // setCurrentWorldAttributes(data)

    // set the comming soon World
    FakeWorldData[WorldNameEnum.COMING_SOON] = {
      worldName: "Coming Soon",
      worldColor: "#000000",
      worldIcon:
        "https://upload.wikimedia.org/wikipedia/en/5/5a/Black_question_mark.png",
      pinsInWorld: 66,
      pinsCollected: 0,
    };

    setWorldAttributes(FakeWorldData);
  };

  const getUnopenedPacksData = async () => {};

  const getInitialData = async () => {
    setIsRefreshing(true);
    await getPinData();
    await getWorldAttributes();
    await getUnopenedPacksData();
    await getNotifications();
    setIsRefreshing(false);
  };

  useEffect(() => {
    getInitialData();
    setCurrentWorld(WorldNameEnum.DEEP_SEA);
  }, []);

  const handleChangeWorld = (world: WorldNameEnum) => {
    setCurrentWorld(world);
  };

  // navigation.setParams({ newPinNotifications: false })

  const getNotifications = async () => {
    // get notifications from server
    // setIsNotificationVisible(true)
    // navigation.newPinNotifications = true
    const notifications = true;
    if (notifications) {
      navigation.setParams({ newPinNotifications: true })
    }
  }

  return (
    <>
    {/* <StackHeaderNotifications name="My Collection" showNotification={isNotificationVisible}/> */}
      <ScreenWrapperComp backgroundColor={Peach} isScreenProtected>
        <PinsCollectedPercentSlider>
          <CollectionPercent
            world={currentWorld && worldAttributes?.[currentWorld]}
          />
        </PinsCollectedPercentSlider>

        <Divider />

        <FlatList
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <ComingSoonText style={{ textAlign: "center" }}>
                  Coming Soon....
                </ComingSoonText>
                <ShhhEmoji style={{ textAlign: "center" }}>🤫</ShhhEmoji>
              </View>
            );
          }}
          numColumns={2}
          style={{ height: "95%", width: "95%" }}
          contentContainerStyle={{ paddingBottom: "30%" }}
          data={currentWorld && pinsData?.[currentWorld]}
          renderItem={({ index, item }) => {
            return (
              <CollectionPinCard
                style={{
                  marginRight: index % 2 !== 0 ? 0 : "4%",
                }}
                src={item.fullColorSrc}
                color={item.worldColor}
                numberOfDuplicates={item.duplicates}
                isHidden={!item.isOwned}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={async () => await getPinData()}
            />
          }
        ></FlatList>

        <WorldPickingWrapper>
          {currentWorld && worldAttributes && (
            <WorldSelector
              currentWorld={currentWorld || {}}
              worldsInfo={worldAttributes || {}}
              handleWorldChange={handleChangeWorld}
            />
          )}
        </WorldPickingWrapper>
      </ScreenWrapperComp>
    </>
  );
};

export default MyCollectionScreen;
