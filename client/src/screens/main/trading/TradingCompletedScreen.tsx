import React, { FC, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, View } from 'react-native';
import styled from 'styled-components/native'
import { completeTradeFirebase } from '../../../../firebase/FirestoreFunctions';
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import { ActiveTradeType } from '../../../../firebase/types/ActiveTradeType';
import TradingUserTopCard from '../../../components/mainComps/trading/TradingUserTopCard';
import { BlueGreen, GrandstanderExtraBold, MulishBold, Orange, backgroundColor, Peach } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';
import BasicButton from '../../../shared/BasicButton';

const OverallMeatWrapper = styled.View`
    margin-top: 10%;
    justify-content: center;
    align-items: center;
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
    console.log(tradeId)
    const [isLoading, setIsLoading] = useState(false);
    const [tradeData, setTradeData] = useState<ActiveTradeType | null>()
    const [receiveUserPhoto, setReceiveUserPhoto] = useState<string | null>(null)

    const getTradingData = async () => {
        setIsLoading(true);
        const tradeData = (await completeTradeFirebase(tradeId)) as ActiveTradeType 
        setTradeData(tradeData || null);
        // TODO get user photo from db
        const userPhoto = "http://cdn.shopify.com/s/files/1/0238/5301/collections/Teal-Lip.jpg?v=1643402323"
        setReceiveUserPhoto(userPhoto || null);
        setIsLoading(false);
    }

    useEffect(() => {
        getTradingData();
    }, [])

    let ItemsOpacity = useRef(new Animated.Value(0)).current;
    let sendInPinY = useRef(new Animated.Value(-800)).current;
    let sendOutPinY = useRef(new Animated.Value(-100)).current;

  const startAnimations = () => {
    // make an timing animation to move the pin down
    console.log("called")
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
                <TradingUserTopCard username={tradeData.receiveUsername} userSrc={receiveUserPhoto} />
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
            <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={tradeData.receivePinSrc} />
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
          <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={tradeData.sendPinSrc} />
        </Animated.View>
        </SendInAndOutWrapper>

        <Animated.View
          style={{
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