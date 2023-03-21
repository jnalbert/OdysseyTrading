import React, { FC, useState, useEffect } from "react";
import { View, Text, RefreshControl, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import CollectionPercent from "../../../components/mainComps/collection/CollectionPercent";
import CollectionPinCard from "../../../components/mainComps/collection/CollectionPinCard";
import StackHeaderNotifications from "../../../components/mainComps/collection/StackHeaderNotifcations";
import WorldSelector from "../../../components/mainComps/collection/WorldSelector";
import { BlueGreen, GrandstanderSemiBold, Peach } from "../../../shared/colors";
import { WorldNameEnum } from "../../../shared/MiscTypes";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";
import { _getUuid } from "../../../AppContext";
import {
  getNumberOfPacksToOpen,
  getPinsForUserCollection,
  getWorldsAttributesMyCollection,
} from "../../../../firebase/FirestoreFunctions";
import { PinTypeDB } from "../../../../firebase/types/PinAndWorldType";
import { useIsFocused } from "@react-navigation/native";

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

// const FakeWorldData: WorldsAttributesType = {
//   [WorldNameEnum.DEEP_SEA]: {
//     worldName: "Deep Sea",
//     worldColor: "#5FB5BF",
//     worldIcon:
//       "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/DeepSeaIcon.png?alt=media&token=22bb8fdb-e4f2-40d9-a9f9-f7accbcb6b8e",
//     pinsInWorld: 13,
//     pinsCollected: 5,
//   },
//   [WorldNameEnum.ENCHANTED_FOREST]: {
//     worldName: "Enchanted Forest",
//     worldColor: "#6b9247",
//     worldIcon:
//       "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/TreeLandIcon.png?alt=media&token=97a786f4-9016-4a66-b9b8-b4590b4be6cf",
//     pinsInWorld: 22,
//     pinsCollected: 22,
//   },
// };

const FakePinData: PinTypeMyCollection[] = [
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: false,
    name: "Pang holding lamp",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fenchanted-forest%2FPang%20%20holding%20a%20lamp.png?alt=media&token=aa399808-348d-45fd-959b-51869a55297a",
    uuid: "u57pSufKF1UaMy11Ifv0",
    worldName: "Enchanted Forest",
    worldUuid: "KgWq71On5txgWug7koEK",
  },
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: false,
    name: "buff bunny butterflie",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fenchanted-forest%2Fbuff%20bunny%20butter%20jump.png?alt=media&token=5595c2a8-fc77-4264-bcfa-cb4b9165b106",
    uuid: "co1C3oZ90mqp7hbQhfnh",
    worldName: "Enchanted Forest",
    worldUuid: "KgWq71On5txgWug7koEK",
  },
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: true,
    name: "frank adventure",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fenchanted-forest%2Ffrank%20on%20an%20adventure.png?alt=media&token=7a220258-36e4-4575-aaa2-d69bf23d35ef",
    uuid: "8Is1GIvAtv7wv78sAGs6",
    worldName: "Enchanted Forest",
    worldUuid: "KgWq71On5txgWug7koEK",
  },
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: true,
    name: "Pang Behind Pole",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fdeep-sea%2FPang%20hiding%20behind%20pole.png?alt=media&token=614010a3-aa21-4a99-9cba-cb5889829187",
    uuid: "ygwupk58L6ugT0OeOy0a",
    worldName: "Deep Sea",
    worldUuid: "EJqJbWuITFn0tVw2VZnL",
  },
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: false,
    name: "Pang Riding Shark",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fdeep-sea%2Fpang%20riding%20on%20shark.png?alt=media&token=56046fa5-4aca-4c41-93fe-aebb2c2febef",
    uuid: "veLbxoEG1iZ95vprt1If",
    worldName: "Deep Sea",
    worldUuid: "EJqJbWuITFn0tVw2VZnL",
  },
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: true,
    name: "pang as santa",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fseasonal%2FPang%20dressing%20up%20as%20Santa!.png?alt=media&token=325f8d5c-0d37-42b6-9886-74b70736bebd",
    uuid: "jQ8yYsMk1T6YOk0jFfSR",
    worldName: "Seasonal",
    worldUuid: "ad2HNtHc046vkmr3E9xy",
  },
  {
    description: "",
    duplicates: 1,
    isAvailableForOpening: true,
    isOwned: false,
    name: "frank and ginger bread man",
    src: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/pins%2Fseasonal%2FFrank%20and%20gingerbread%20man.png?alt=media&token=18cacdf6-d184-4982-930c-0970d78a992d",
    uuid: "g9dj7o7TQqwXfNrvmHpw",
    worldName: "Seasonal",
    worldUuid: "ad2HNtHc046vkmr3E9xy",
  },
];

interface PinTypeMyCollection extends PinTypeDB {
  duplicates: number;
  isOwned: boolean;
}

export interface WorldType {
  worldName: string;
  worldColor: string;
  worldIcon: string;
  numPinsInWorld: number;
  numPinsCollected: number;
}
const switchCaseToGetWorld = (world: WorldNameEnum) => {
  switch (world) {
    case WorldNameEnum.ENCHANTED_FOREST:
      return "Enchanted Forest"
    case WorldNameEnum.DEEP_SEA:
      return "Deep Sea"
    case WorldNameEnum.SEASONAL:
      return "Seasonal"
    default:
      return "Coming Soon"
  }
}

// make a type script type that is an object with string keys and PinType values
export type PinsDataMyCollection = {
  [key in WorldNameEnum]?: PinTypeMyCollection[];
};

export type WorldsAttributesType = { [key in WorldNameEnum]?: WorldType };

const MyCollectionScreen: FC<any> = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [worldIsChanging, setWorldIsChanging] = useState(false);

  const [allPinsData, setAllPinsData] = useState<PinTypeMyCollection[]>();
  const [worldAttributes, setWorldAttributes] =
    useState<WorldsAttributesType>();
  const [currentPins, setCurrentPins] = useState<PinTypeMyCollection[]>([]);
  const [deepSeaPins, setDeepSeaPins] = useState<PinTypeMyCollection[]>([]);
  const [enchantedForestPins, setEnchantedForestPins] = useState<PinTypeMyCollection[]>([]);
  const [seasonalPins, setSeasonalPins] = useState<PinTypeMyCollection[]>([]);
  const [currentWorld, setCurrentWorld] = useState<WorldNameEnum>(WorldNameEnum.DEEP_SEA)
  const [causeReRender, setCauseReRender] = useState(false)

  const getPinData = async () => {
    // fetch data from server
    const uuid = await _getUuid();
    const pinData = await getPinsForUserCollection(uuid || "");
    if (!pinData) return;
    // console.log(pinData[WorldNameEnum.SEASONAL]);

    // sort all of the pins as it comes in by te isOwned property
    // loop through fake data and sort it
    // const pinData: PinTypeMyCollection[] = FakePinData
    // sort the pins by isOwned
    pinData.sort((a: any, b: any): any => {
      if (a.isOwned && !b.isOwned) {
        return -1;
      }})
    // the coming soon world to an empty array
      // duplication of data for testing purposes
      // const Data: any = FakePinData[world as WorldNameEnum]
      // FakePinData[world as WorldNameEnum] = [...Data, ...Data, ...Data, ...Data, ...Data]
    // filter out the pins in the current world into a new array
    const deepSeaPins = pinData.filter((pin: any) => pin.worldName === "Deep Sea")
    const enchantedForestPins = pinData.filter((pin: any) => pin.worldName === "Enchanted Forest")
    const seasonalPins = pinData.filter((pin: any) => pin.worldName === "Seasonal")
    // set the current pins to the new array
    setDeepSeaPins(deepSeaPins)
    setEnchantedForestPins(enchantedForestPins)
    setSeasonalPins(seasonalPins)
    setAllPinsData(pinData);
  };

  const getWorldAttributes = async () => {
    // fetch data from server
    // setCurrentWorldAttributes(data)
    const uuid = await _getUuid();
    const worldAttributes = await getWorldsAttributesMyCollection(uuid || "");
    // console.log(worldAttributes)

    if (!worldAttributes) return;
    // set the comming soon World
    worldAttributes[WorldNameEnum.COMING_SOON] = {
      worldName: "Coming Soon",
      worldColor: "#000000",
      worldIcon:
        "https://upload.wikimedia.org/wikipedia/en/5/5a/Black_question_mark.png",
      numPinsInWorld: 66,
      numPinsCollected: 0,
    };

    setWorldAttributes(worldAttributes);
  };

  const getInitialData = async () => {
    setIsRefreshing(true);
    await getPinData();
    await getWorldAttributes();
    await getNotifications();
    setIsRefreshing(false);
  };

  useEffect(() => {
    getInitialData();
    // setCurrentPins(pinsData?.[WorldNameEnum.DEEP_SEA] || []);
  }, []);

  const handleChangeWorld = async (world: WorldNameEnum) => {
    setWorldIsChanging(true);
    // get the current pins
    // const currentPins = allPinsData?.filter(pin => pin.worldName === switchCaseToGetWorld(world))
    // setCurrentPins([])
    // setCurrentPins(currentPins || []);
    setCurrentWorld(world);
    // sleep for 1 second to simulate loading
    setWorldIsChanging(false);
    // console.log(currentPins)
  };

  // navigation.setParams({ newPinNotifications: false })

  const getNotifications = async () => {
    // get notifications from server
    // setIsNotificationVisible(true)
    // navigation.newPinNotifications = true
    const uuid = await _getUuid();
    const packsToOpen = await getNumberOfPacksToOpen(uuid || "");
    if (packsToOpen && packsToOpen > 0) {
      navigation.setParams({ newPinNotifications: true });
      // setCauseReRender(!causeReRender)
    }
  };

  const getDataToUse = () => {
    if (currentWorld === WorldNameEnum.DEEP_SEA) {
      return deepSeaPins;
    } else if (currentWorld === WorldNameEnum.ENCHANTED_FOREST) {
      return enchantedForestPins;
    } else if (currentWorld === WorldNameEnum.SEASONAL) {
      return seasonalPins;
    } else {
      return [];
    }
  }

  const isFocused = useIsFocused();
  useEffect(() => {
    getNotifications()
  }, [isFocused]);

  return (
    <>
      {/* <StackHeaderNotifications name="My Collection" showNotification={isNotificationVisible}/> */}
      <ScreenWrapperComp backgroundColor={Peach} isScreenProtected>
        <PinsCollectedPercentSlider>
          <CollectionPercent world={worldAttributes?.[currentWorld]} />
        </PinsCollectedPercentSlider>

        <Divider />

{/* seet if the world is currently changed */}
{worldIsChanging ? (
  <ActivityIndicator>

  </ActivityIndicator>
) : (
<FlatList
refreshing={worldIsChanging}
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
          data={getDataToUse()}
          renderItem={({ index, item }) => {
            let color =
              worldAttributes?.[currentWorld]?.worldColor || "#000000";

            return (
              <CollectionPinCard
                isChangingScreen={isRefreshing}
                style={{
                  marginRight: index % 2 !== 0 ? 0 : "4%",
                }}
                src={item.src}
                color={color}
                numberOfDuplicates={item.duplicates}
                isHidden={!item.isOwned}
                key={item.uuid}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={async () => await getInitialData()}
            />
          }
        ></FlatList>
) }
        

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
