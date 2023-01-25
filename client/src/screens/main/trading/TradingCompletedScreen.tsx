import React, { FC, useEffect, useState } from 'react'
import { Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native'
import { completeTradeFirebase } from '../../../../firebase/FirestoreFunctions';
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import { ActiveTradeType } from '../../../../firebase/types/ActiveTradeType';
import TradingUserTopCard from '../../../components/mainComps/trading/TradingUserTopCard';
import { BlueGreen, GrandstanderExtraBold, MulishBold, Orange } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';

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
    margin-bottom: 5%;
`
const SendInAndOutWrapper = styled.View`
    width: 100%;
    height: 100%;
`

const PinWrapper = styled.View`
    width: 50%;
    height: 30%;
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

    let ItemsOpacity = new Animated.Value(0.5);
    let sendInPinY = new Animated.Value(0);
    let sendOutPinY = new Animated.Value(0);


  const sendOutPin = () => {
    // make an timing animation to move the pin up
    Animated.timing(sendInPinY, {
        toValue: -100,
        duration: 1200,
        easing: Easing.cubic,
        useNativeDriver: true,
    }).start();
  };
  const sendInPin = () => {
    // make an timing animation to move the pin down
    Animated.timing(sendOutPinY, {
        toValue: 0,
        duration: 1200,
        easing: Easing.cubic,
        useNativeDriver: true,
    }).start();
  }
  const makeTextVisible = () => {
    Animated.timing(ItemsOpacity, {
        toValue: 1,
        duration: 1200,
        easing: Easing.cubic,
        useNativeDriver: true,
    }).start();
  }

  return (
    <ScreenWrapperComp>
        <>
      {!isLoading && tradeData && receiveUserPhoto && (
        <>
        <Animated.View
            style={{
                opacity: ItemsOpacity,
            }}
            >
            <OverallMeatWrapper>
                <HeaderText>Congratulations!!</HeaderText>
                <SubHeaderCompletedText>You just completed a trade with:</SubHeaderCompletedText>
                <TradingUserTopCard username={tradeData.receiveUsername} userSrc={receiveUserPhoto} />
                <ReceivedText>You Received</ReceivedText>
            </OverallMeatWrapper>
            <PinWrapper>
                <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={tradeData.receivePinSrc} />
            </PinWrapper>
        </Animated.View>

        {/* send In Pin */}
        <SendInAndOutWrapper>
        <Animated.View
            style={{
                transform: [
                    {translateY: sendInPinY}
                ],
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                // position: "absolute",
                // bottom: "50%",
                // top: "50%",
            }}
        >
            <PinWrapper>
                <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={tradeData.receivePinSrc} />
            </PinWrapper>
        </Animated.View>

        {/* send Out Pin */}
        <Animated.View
            style={{
                transform: [
                    {translateY: sendOutPinY}
                ],
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                // position: "absolute",
                // bottom: "50%",
                // top: "50%",
            }}
        >
            <PinWrapper>
                <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode="contain" src={tradeData.sendPinSrc} />
            </PinWrapper>
        </Animated.View>
        </SendInAndOutWrapper>
        
        
        </>
      )}
      </>
    </ScreenWrapperComp>
  )
}

export default TradingCompletedScreen