import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, View } from 'react-native';
import styled from 'styled-components/native'
import { completeTradeFirebase, FinishTrading, getProfileDataFromDB } from '../../../../firebase/FirestoreFunctions';
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import { ActiveTradeType } from '../../../../firebase/types/ActiveTradeType';
import TradingUserTopCard from '../../../components/mainComps/trading/TradingUserTopCard';
import { BlueGreen, GrandstanderExtraBold, MulishBold, Orange, backgroundColor, Peach } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';
import BasicButton from '../../../shared/BasicButton';
import { _getUuid } from '../../../AppContext';

const OverallMeatWrapper = styled.View`
    margin-top: 6%;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const HeaderText = styled.Text`
    font-family: ${GrandstanderExtraBold};
    font-size: 30px;
    color: ${BlueGreen};
    margin-bottom: 7%;
    `
const SubHeaderCompletedText = styled.Text`
    font-family: ${MulishBold};
    font-size: 16px;
    margin-bottom: 5%;
`
const ReceivedText = styled.Text`
    font-family: ${GrandstanderExtraBold};
    font-size: 25px;
    color: ${Orange};
    margin-top: 10%;
`
const SendInAndOutWrapper = styled.View`
    width: 100%;
    height: 180px;
    align-items: center;
    justify-content: center;
`

const PinWrapper = styled.View`
    width: 40%;
    height: 20%;
    background-color: red;
    position: absolute;
`

const BackHomeWrapper = styled.View`
    width: 100%;
`


const TradingCompletedScreen: FC<any> = ({route, navigation}) => {
    const {tradeId} = route.params;
    // console.log(tradeId)
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitched, setIsSwitched] = useState(false);
    const [tradeData, setTradeData] = useState<ActiveTradeType | null>()
    const [receiveUserPhoto, setReceiveUserPhoto] = useState<string | null>(null)
    const [receiveUserUsername, setReceiveUserUsername] = useState<string | null>(null)

    const getTradingData = async () => {
        setIsLoading(true);
        const tradeData = (await completeTradeFirebase(tradeId)) as ActiveTradeType 
        // console.log("Other trade doc", tradeData)
        setTradeData(tradeData || null);
        doEndOfTradingThings(tradeData)
        // check if user is switced
  
        let isUserSwitched = false;
        const uuid = await _getUuid()
        if (tradeData?.receiveUserUuid === uuid) {
            isUserSwitched = true;
            setIsSwitched(true)
        }
        // TODO get user photo from db
        // swtich the trade Data if user is switched
        const getPhotoUuid = isUserSwitched ? tradeData?.receiveUserUuid : tradeData?.sendUserUuid
        const getUsername = isUserSwitched ? tradeData?.receiveUsername : tradeData?.sendUsername
        const userPhoto = (await getProfileDataFromDB(getPhotoUuid))?.profilePhoto || null
        setReceiveUserPhoto(userPhoto);
        setReceiveUserUsername(getUsername);
        setIsLoading(false);

    }

    const doEndOfTradingThings = async (tradeDataPass: ActiveTradeType) => {
      // console.log("do end things", tradeDataPass)
      const uuid = await _getUuid()
      if (!tradeDataPass) return
      // console.log("finsh trading")
      await FinishTrading(tradeDataPass, uuid || "")
    }

    useEffect(() => {
        getTradingData();
    }, [])

    let ItemsOpacity = useRef(new Animated.Value(0)).current;
    let sendInPinY = useRef(new Animated.Value(-800)).current;
    let sendOutPinY = useRef(new Animated.Value(-100)).current;

  const startAnimations = () => {
    // make an timing animation to move the pin down
    // console.log("called")
    const sendOutPin = Animated.timing(sendOutPinY, {
      toValue: -800,
      duration: 2200,
      easing: Easing.linear,
      useNativeDriver: true,
  })
    const sendInPin = Animated.timing(sendInPinY, {
        toValue: 0,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
    })
    const makeVisible = Animated.timing(ItemsOpacity, {
      toValue: 1,
      duration: 1200,
      easing: Easing.cubic,
      useNativeDriver: true,
  })
    Animated.sequence([sendOutPin, sendInPin, makeVisible]).start();
  }

  useEffect(() => {
    startAnimations();
  }, [tradeData])

  const returnHome = () => {
    // TODO: go to main trading and pass params to the screen to tell it to refresh the qr code
    navigation.navigate("MainTrading")
  }

  const screenHeight = Dimensions.get("window").height; 

  return (
    <ScreenWrapperComp>
        <>
      {!isLoading && tradeData && receiveUserPhoto && (
        <>
        <Animated.View
            style={{
                opacity: ItemsOpacity,
                // flex: 1,
                height: "50%",
            }}
            >
            <OverallMeatWrapper>
                <HeaderText>Congratulations!!</HeaderText>
                <SubHeaderCompletedText>You just completed a trade with:</SubHeaderCompletedText>
                <TradingUserTopCard username={receiveUserUsername || ""} userSrc={receiveUserPhoto} />
                <ReceivedText>You Received</ReceivedText>
            </OverallMeatWrapper>
        </Animated.View>
        <SendInAndOutWrapper>
          <Animated.View style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transform: [
                {translateY: sendInPinY}
            ]
          }}>
            <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={isSwitched ? tradeData.sendPinSrc : tradeData.receivePinSrc} />
          </Animated.View>
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transform: [
                {translateY: sendOutPinY}
            ]
          }}
        >
          <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={isSwitched ? tradeData.receivePinSrc : tradeData.sendPinSrc} />
        </Animated.View>
        </SendInAndOutWrapper>

        <Animated.View
          style={{
            marginTop: "12%",
            opacity: ItemsOpacity,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BasicButton border boxShadow style={{backgroundColor: Orange, width: 200, height: 56}} buttonTextStyle={{color: Peach, fontSize: 22}} onPress={returnHome} title="Back Home"  />
        </Animated.View>

        </>
      )}
      </>
    </ScreenWrapperComp>
  )
}

export default TradingCompletedScreen