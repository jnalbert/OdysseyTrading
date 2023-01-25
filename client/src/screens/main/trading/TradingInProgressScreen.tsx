import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { FC, useState, useEffect } from 'react'
import { RefreshControl, View, Dimensions } from 'react-native';
import styled from 'styled-components/native'
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import { db } from '../../../../config/firebase';
import { ActiveTradeType } from '../../../../firebase/types/ActiveTradeType';
import TradingUserTopCard from '../../../components/mainComps/trading/TradingUserTopCard';
import { _getUuid } from '../../../AppContext';
import { cancelActiveTrade, deleteActiveTrade, updateActiveTrade } from '../../../../firebase/FirestoreFunctions';
import CurrentPinChoiceCard from '../../../components/mainComps/trading/CurrentPinChoiceCard';
import { Fontisto } from '@expo/vector-icons'; 
import BasicButton from '../../../shared/BasicButton';
import ConfirmUnConfirmButton from '../../../components/mainComps/trading/ConfirmUnConfirmButton';

const OverallWrapper = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`

const TopCardsWrapper = styled.View`
  margin-top: 2%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const CurrentPinChoicesWrapper = styled.View`
  margin-top: 5%;
  flex-direction: row;
  align-items: center;
  width: 88%;
  height: 15%;
  justify-content: space-between;
`
const SwapSvgWrapper = styled.View`
  height: 50%;
  justify-content: center;
`

const ConfirmUnConfirmWrapper = styled.View`
  margin-top: 5%;
  width: 100%;
  /* justify-content: center; */
  align-items: center;
`

interface ChangingTradeData {
  sendPinSrc: string;
  receivePinSrc: string;
  sendPinUuid: string;
  receivePinUuid: string;
  senderConfirmed: boolean;
  receiverConfirmed: boolean;
}

interface UnchangingTradeData {
  sendUserUuid: string;
  sendUsername: string;
  receiveUserUuid: string;
  receiveUsername: string;
  sendProfilePhoto: string;
  receiveProfilePhoto: string;
}

const TradingInProgressScreen: FC<any> = ({route, navigation}) => {
  const [initialDataLoading, setInitialDataLoading] = useState(true)
  const [isSwitched, setIsSwitched] = useState(false)
  const [currentUserUuid, setCurrentUserUuid] = useState<string>("")
  const [unchangingTradeData, setUnchangingTradeData] = useState<UnchangingTradeData>()
  const [changingTradeData, setChangingTradeData] = useState<ChangingTradeData>()

  const {tradeId} = route.params

  const handleTradeDocChanges = (TradeDocData: ActiveTradeType, uuid: string) => {
    let innerIsSwitched = false
    if (TradeDocData.receiveUserUuid === uuid) {
      innerIsSwitched = true
      setIsSwitched(true)
    }
    if (TradeDocData.isCanceled) {
      // TODO do Something
      deleteActiveTrade(tradeId)
      navigation.navigate("MainTrading")
      return
    }
    if (unchangingTradeData === undefined) {
      // TODO get profile photos from DB
      const sendProfilePhoto = "http://cdn.shopify.com/s/files/1/0238/5301/collections/Teal-Lip.jpg?v=1643402323"
      const receiveProfilePhoto = "https://surfd.com/wp-content/uploads/2021/12/Grossman-Feature-1.jpg"
      // first time getting data
      console.log(TradeDocData.receiveUserUuid, " ", uuid)
      if (innerIsSwitched) {
          setUnchangingTradeData({
            sendUserUuid: TradeDocData.receiveUserUuid,
            sendUsername: TradeDocData.receiveUsername,
            receiveUserUuid: TradeDocData.sendUserUuid,
            receiveUsername: TradeDocData.sendUsername,
            sendProfilePhoto: receiveProfilePhoto,
            receiveProfilePhoto: sendProfilePhoto,
          })
      } else {
        setUnchangingTradeData({
          sendUserUuid: TradeDocData.sendUserUuid,
          sendUsername: TradeDocData.sendUsername,
          receiveUserUuid: TradeDocData.receiveUserUuid,
          receiveUsername: TradeDocData.receiveUsername,
          sendProfilePhoto: sendProfilePhoto,
          receiveProfilePhoto: receiveProfilePhoto,
        })
      }
     
    } 
    if (innerIsSwitched) {
      setChangingTradeData({
        sendPinSrc: TradeDocData.receivePinSrc,
        receivePinSrc: TradeDocData.sendPinSrc,
        sendPinUuid: TradeDocData.receivePinUuid,
        receivePinUuid: TradeDocData.sendPinUuid,
        senderConfirmed: TradeDocData.receiverConfirmed,
        receiverConfirmed: TradeDocData.senderConfirmed
      })
    } else {
      setChangingTradeData({
        sendPinSrc: TradeDocData.sendPinSrc,
        receivePinSrc: TradeDocData.receivePinSrc,
        sendPinUuid: TradeDocData.sendPinUuid,
        receivePinUuid: TradeDocData.receivePinUuid,
        senderConfirmed: TradeDocData.senderConfirmed,
        receiverConfirmed: TradeDocData.receiverConfirmed
      })
    }
    setInitialDataLoading(false)
  }

  const startInitial = async () => {
    const uuid = await _getUuid()
    setCurrentUserUuid(uuid as string)
    const unsub = onSnapshot(doc(db, "active-trades", tradeId), (doc) => {
      handleTradeDocChanges(doc.data() as ActiveTradeType, uuid as string)
    })
    return unsub
  }

  useEffect(() => {
  let unsubFunc: any
    startInitial().then((unsub) => {
      unsubFunc = unsub
    })
    return () => {
      // cleanUpTrade()
      unsubFunc()
    }
  }, [])

  const cleanUpTrade = async () => {
    await cancelActiveTrade(tradeId)
  }

  const pinChoiceChanged = async (pinUuid: string, pinSrc: string) => {
    // TODO update DB with changing Data
    // TODO update UI with change
  }

  const handConfirmUnconfirm = async () => {
    // TODO update DB with changing Data
    if (!changingTradeData) return

    setChangingTradeData({
      ...changingTradeData,
      senderConfirmed: !changingTradeData.senderConfirmed
    })

    let sendData: any = {
      senderConfirmed: !changingTradeData.senderConfirmed
    }
    if (isSwitched) {
      sendData = {
        receiverConfirmed: !changingTradeData.senderConfirmed
      }
    }
    await updateActiveTrade(tradeId, sendData)

  }

  // get the screen Dimension
    const screenHeight = Dimensions.get("window").height
    const screenWidth = Dimensions.get("window").width

  return (
    <ScreenWrapperComp scrollView>
      <OverallWrapper
        style={{ 
          height: screenHeight,
          width: screenWidth,
        }}
      >
        {unchangingTradeData && (
          <TopCardsWrapper>
            <TradingUserTopCard username={unchangingTradeData.sendUsername} userSrc={unchangingTradeData.sendProfilePhoto} />
            <TradingUserTopCard username={unchangingTradeData.receiveUsername} userSrc={unchangingTradeData.receiveProfilePhoto} />
          </TopCardsWrapper>
        )}
      {changingTradeData && (
        <CurrentPinChoicesWrapper>
          <CurrentPinChoiceCard pinSrc={changingTradeData.sendPinSrc} isConfirmed={changingTradeData.senderConfirmed} />
          <SwapSvgWrapper>
            <Fontisto name="arrow-swap" size={50} color="#323232" />
          </SwapSvgWrapper>
          <CurrentPinChoiceCard pinSrc={changingTradeData.receivePinSrc} isConfirmed={changingTradeData.receiverConfirmed}  />
        </CurrentPinChoicesWrapper>
      )}
       
       {changingTradeData && (
        <ConfirmUnConfirmWrapper>
          <ConfirmUnConfirmButton isConfirmed={changingTradeData.senderConfirmed} isOtherUserConfirmed={changingTradeData.receiverConfirmed} handleClick={handConfirmUnconfirm} />
        </ConfirmUnConfirmWrapper>
       )}
        
      </OverallWrapper>
    </ScreenWrapperComp>
  )
}

export default TradingInProgressScreen