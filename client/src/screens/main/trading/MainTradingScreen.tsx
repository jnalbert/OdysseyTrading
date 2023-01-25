import React, { FC, useEffect, useState } from "react";
import { View, Dimensions, RefreshControl, Alert } from 'react-native';
import styled from "styled-components/native";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";
import QRCode from 'react-native-qrcode-svg';
import { Peach, Orange, MulishBold, Black, BlueGreen, Pink, GrandstanderExtraBold, Text300, Text400, logoutRed } from '../../../shared/colors';
import BasicButton from '../../../shared/BasicButton';
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FlatList } from "react-native-gesture-handler";
import PastTradeCard from "../../../components/mainComps/trading/PastTradeCard";
import { AntDesign } from '@expo/vector-icons'; 
import { BarCodeScanner } from "expo-barcode-scanner";
import { Feather } from '@expo/vector-icons'; 
import { doc, DocumentData, onSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { deleteActiveTrade, startActiveTrade, updateActiveTrade } from "../../../../firebase/FirestoreFunctions";
import { db } from "../../../../config/firebase";
import { ActiveTradeType } from "../../../../firebase/types/ActiveTradeType";

const QRCodeWrapper = styled.View`
  /* border: 1px solid black; */
  margin-top: 4%;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
`;


const BelowQRCodeWrapper = styled.View`
  margin-top: 5%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const BelowQRCodeInfoWrapper = styled.View`
  flex-direction: column;
  /* width: 100%; */
`;

const ScanCodeWrapper = styled.View`
  align-self: flex-end;
`;

const ScanCodeSVG = styled.TouchableOpacity`
  /* width: 40%; */
`;

const UserNameText = styled.Text`
  text-align: center;
  font-family: ${MulishBold};
  color: ${Black};
  font-size: 20px;
`;

const StepsTextWrapper = styled.TouchableOpacity`
  margin-top: 5%;
`;
const StepsText = styled.Text`
  font-family: ${MulishBold};
  text-align: center;
  color: ${BlueGreen};
`;

const PageDivider = styled.View`
  margin-top: 5%;
  width: 130%;
  height: 1px;
  background-color: black;
`;

const PastTradesWrapper = styled.View`
  width: 100%;
`;

const PastTradesTitleWrapper = styled.View`
  margin-top: 5%;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const PastTradesTitle = styled.Text`
  font-family: ${GrandstanderExtraBold};
  color: ${BlueGreen};
  font-size: 24px;
`

const NoPinsYetText = styled.Text`
  font-family: ${MulishBold};
  font-size: 16px;
  text-align: center;
  color: ${Text400};
`
const ScannerXWrapper = styled.TouchableOpacity`
  position: absolute;
  top: 5%;
  right: 5%;
  z-index: 100;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 50%;
  padding: 2px;
`


interface TradingUserInformation {
  uuid: string;
  username: string;
}
const fakeTrade = {
  tradeUuid: "12332sf",
  sendUserUuid: "123",
  sendUserName: "jalbert879",
  receiveUserName: "ElyNk",
  receiveUserUuid: "1236",
  sendPinSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20in%20a%20flower.png?alt=media&token=5dc21ba1-0c99-4c71-a5f8-ee7e332ea68f",
  receivePinSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/buff%20bunny%20ft.%20sleepy%20shroom.png?alt=media&token=0076d12f-7b39-4e29-9edc-87a3e71b3d95",
  date: new Date().toDateString(),
}

const fakePastTrades: PastTrade[] = [{...fakeTrade, tradeUuid: "fonweklffsdf"}, {...fakeTrade, tradeUuid: "23423423"}, fakeTrade]

export interface PastTrade {
  tradeUuid: string;
  sendUserUuid: string;
  sendUserName: string;
  receiveUserName: string;
  receiveUserUuid: string;
  sendPinSrc: string;
  receivePinSrc: string;
  date: string;
}

const MainTradingScreen: FC<any> = ({navigation}) => {
  const [userInformation, setUserInformation] = useState<TradingUserInformation>({ uuid: "", username: "" });
  const defaultTradeCode = "";
  const [activeTradeCode, setActiveTradeCode] = useState<string>(defaultTradeCode);
  const [pastTrades, setPastTrades] = useState<PastTrade[]>([]);
  const [isPastTradesLoading, setIsPastTradesLoading] = useState<boolean>(false);
  const [isLoadingQrCode, setIsLoadingQrCode] = useState<boolean>(false);
  const [unsubDB, setUnsubDB] = useState<any>(() => {});


  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const [scanned, setScanned] = useState(false);

  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true);
    } else {
      Alert.alert("Camera access denied", "Please enable camera access in your settings to scan QR codes");
    }
  };

  const getInitialUserData = async () => {
    //TODO get data from server ********
    // call server function to get the user information
    setUserInformation({ uuid: "ZpLZ5ugg23d7DlhzkMKwAF4UCgR2", username: "jnalbert879" });
  }
  const getPastTrades = async () => {
    setIsPastTradesLoading(true);
    /// TODO get Data from server *******
    setPastTrades(fakePastTrades);
    setIsPastTradesLoading(false);
  };

  useEffect(() => {
    getPastTrades();
    getInitialUserData()
  }, []);

  // once the screen goes out of focus, clear the active trade code
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused || hasPermission) {
      setActiveTradeCode(defaultTradeCode)
      if (activeTradeCode !== defaultTradeCode) {
        deleteActiveTrade(activeTradeCode)
      }
      
    }
  }, [isFocused, hasPermission]);

  const getActiveTradeCode = async () => {
    //TODO get data from server ********
    // call server function to start the active trade and get the code
    setIsLoadingQrCode(true);
    const {tradeCode} = await startActiveTrade(userInformation);
    console.log(tradeCode, "trade")
    setActiveTradeCode(tradeCode);
    setIsLoadingQrCode(false);

    onSnapshot(doc(db, "active-trades", tradeCode), (doc) => {
      handleDocUpdate(doc.data())
    })
  }
  const handleDocUpdate = (activeTradeDoc: DocumentData | undefined) => {
    if (activeTradeDoc?.receiveUserUuid !== "") {
      // someone has matched the trade
      navigation.navigate("TradingInProgress", { tradeId: activeTradeCode })
    }
  }

  const handleScanCode = async () => {
/// TODO DEV THINGS ********
    const devTradeCode = "xSQNKvm6pq6V0Rt7NOIV";
    navigation.navigate("TradingInProgress", { tradeId: devTradeCode })

    /// TODO DEV TINGS TO PUT BACK ******
    // await getBarCodeScannerPermissions()
  }

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    handleFoundQRCode(data)
  };

  const handleFoundQRCode = async (tradeUuid: string) => {
    //TODO updated active trade on sever with current uuid and userName ********
    await updateActiveTrade(tradeUuid, userInformation)
    // go to continue trading screen with the tradeUuid
    // console.log("n")
    navigation.navigate("TradingInProgress", { tradeId: tradeUuid })
  }
  // ****** TODO SET SCANNED BACK TO FALSE BEFORE YOU LEAVE SCREEN *****

  const handleExitScanner = () => {
    setHasPermission(false);
    setScanned(false);
  }

  // get the screen width
  const screenWidth60 = Dimensions.get("window").width * 0.6
  return (
    <>
    {hasPermission ? (
      <>
        <ScannerXWrapper
          onPress={handleExitScanner}
        >
          <Feather name="x" size={50} color={logoutRed} />
        </ScannerXWrapper>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style = {{
            height:  "100%",
            width: "100%",
          }}
          barCodeTypes={[
            BarCodeScanner.Constants.BarCodeType.qr,
          ]}
          />
        </>
    )
    : (
<ScreenWrapperComp isScreenProtected>
      <QRCodeWrapper style={{width: screenWidth60, height: screenWidth60}}>
      {activeTradeCode ? (
          <QRCode backgroundColor={Peach} size={screenWidth60} value={activeTradeCode} />
      ) : (
        <BasicButton isDisabled={isLoadingQrCode} border boxShadow style={{backgroundColor: Orange, width: screenWidth60, height: 70}} buttonTextStyle={{color: Peach, fontSize: 22}} onPress={getActiveTradeCode} title="Start Trading"  />
      )}
       </QRCodeWrapper>
      
      <BelowQRCodeWrapper>
        <BelowQRCodeInfoWrapper style={{ 
          marginLeft: "auto",
          paddingLeft: 50
        }}>
          <UserNameText>@{userInformation.username}</UserNameText>
          <StepsTextWrapper>
            <StepsText>How does it work</StepsText>
          </StepsTextWrapper>
        </BelowQRCodeInfoWrapper>
        <ScanCodeWrapper style={{marginLeft: "auto"}} >
          <ScanCodeSVG onPress={handleScanCode}>
            <MaterialCommunityIcons name="qrcode-scan" size={40} color={BlueGreen} />
          </ScanCodeSVG>
        </ScanCodeWrapper>
      </BelowQRCodeWrapper>
      <PageDivider></PageDivider>
      <PastTradesWrapper>
        <PastTradesTitleWrapper>
          <PastTradesTitle>Past Trades</PastTradesTitle>
          <AntDesign style={{marginLeft: "4%", paddingBottom: 2}} name="arrowright" size={25} color={BlueGreen} />
        </PastTradesTitleWrapper>
        <FlatList
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  marginTop: "5%",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <NoPinsYetText>
                  None yet! Start trading!
                </NoPinsYetText>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: "8%" }}
          style={{ marginTop: "3%", height: "44%", width: "100%"}}
          data={pastTrades}
          keyExtractor={(item) => item.tradeUuid}
          renderItem={({ item }) => (

            <PastTradeCard {...item} />

          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={isPastTradesLoading}
              onRefresh={async () => await getPastTrades()}
            />
          }
        />
      </PastTradesWrapper>
    </ScreenWrapperComp>
    )
  }
    
    
    </>
  );
};

export default MainTradingScreen;
