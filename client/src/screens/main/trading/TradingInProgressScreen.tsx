import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { FC, useState, useEffect } from 'react'
import { RefreshControl, View, Dimensions } from 'react-native';
import styled from 'styled-components/native'
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import { db } from '../../../../config/firebase';
import { ActiveTradeType } from '../../../../firebase/types/ActiveTradeType';
import TradingUserTopCard from '../../../components/mainComps/trading/TradingUserTopCard';
import { _getUuid } from '../../../AppContext';
import { cancelActiveTrade, constGetPinsForTrading, deleteActiveTrade, getAllWorldsForTrading, getProfileDataFromDB, updateActiveTrade } from '../../../../firebase/FirestoreFunctions';
import CurrentPinChoiceCard from '../../../components/mainComps/trading/CurrentPinChoiceCard';
import { Fontisto } from '@expo/vector-icons'; 
import ConfirmUnConfirmButton from '../../../components/mainComps/trading/ConfirmUnConfirmButton';
import PinPickingSection from '../../../components/mainComps/trading/PinPickingSection';
import { GrandstanderExtraBold, logoutRed } from '../../../shared/colors';
import BasicButton from '../../../shared/BasicButton';
import { PinTypeDB, WorldTypeDB } from '../../../../firebase/types/PinAndWorldType';

const OverallWrapper = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  /* margin-bottom: 20%; */
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

const PinsToChooseWrapper = styled.View`
  margin-top: 5%;
  flex-direction: column;
  width: 80%;
`

const PinsHeaderWrapper = styled.View`
  margin-top: 7%;
  width: 85%;
`
const PinsHeader = styled.Text`
  font-family: ${GrandstanderExtraBold};
  font-size: 30px;
  color: #000000;
`

const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: #000000;
`

const CancelTradeButtonWrapper = styled.View`
  margin-top: 10%;
  width: 80%;
  margin-bottom: 40%;
`

interface PinWorld {
  worldName: string;
  worldColor: string;
  worldIcon: string;
  pinsInWorld: number;
  uuid: string;
}
const FakeWorldData: PinWorld[] = [
  {
    worldName: "Deep Sea",
    worldColor: "#5FB5BF",
    worldIcon: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/DeepSeaIcon.png?alt=media&token=22bb8fdb-e4f2-40d9-a9f9-f7accbcb6b8e",
    pinsInWorld: 13,
    uuid: "1234"
  },
  {
    worldName: "Enchanted Forest",
    worldColor: "#6b9247",
    worldIcon: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/TreeLandIcon.png?alt=media&token=97a786f4-9016-4a66-b9b8-b4590b4be6cf",
    pinsInWorld: 13,
    uuid: "12345"
  }
]

export type PinsType = {
  uuid: string;
  name: string;
  worldUuid: string;
  fullColorSrc: string;
}

const FakePinData: PinsType[] = [
  {
    uuid: "123234",
    name: "Pang Searching For Home",
    worldUuid: "1234",
    fullColorSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73",
  },
  {
    uuid: "123233s4",
    name: "Pang Searching For Home",
    worldUuid: "1234",
    fullColorSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73"
  },
  {
    uuid: "12323323s4",
    name: "Pang Searching For Home",
    worldUuid: "1234",
    fullColorSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20searching%20for%20home%20(2).png?alt=media&token=8f976977-5764-4061-9425-71a52f644c73"
  },
  {
    uuid: "124",
    name: "Buff bunny",
    worldUuid: "12345",
    fullColorSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frankie%20petting%20wolf.png?alt=media&token=e673b94a-777a-4337-a052-3531c7e737ae"
  },
  {
    uuid: "12f2334",
    name: "Frank Traveling",
    worldUuid: "12345",
    fullColorSrc: "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/frank%20traveling.png?alt=media&token=57a5f1c5-9bb9-4a8f-9f16-ff60ef19fdaf"
  },
]



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
  const [unchangingTradeData, setUnchangingTradeData] = useState<UnchangingTradeData>()
  const [changingTradeData, setChangingTradeData] = useState<ChangingTradeData>()
  const [usersPins, setUsersPins] = useState<PinTypeDB[]>()
  const [pinWorlds, setPinWorlds] = useState<WorldTypeDB[]>()
  const [selectedPin, setSelectedPin] = useState<PinTypeDB>()
  const [isFinished, setIsFinished] = useState(false)

  const getPinsAndWorlds = async () => {
    setInitialDataLoading(true)
    const uuid = await _getUuid()
    const dBPins = await constGetPinsForTrading(uuid || "")
    const DbWorlds = await getAllWorldsForTrading()
    setUsersPins(dBPins)
    setPinWorlds(DbWorlds)
    setInitialDataLoading(false)
  }

  const {tradeId} = route.params
  
// console.log(tradeId, "Route Param")

  const handleTradeDocChanges = async (TradeDocData: ActiveTradeType, uuid: string) => {
    // console.log(TradeDocData, "Trade Doc Data")
    // console.log("yere")
    // console.log("data from db", TradeDocData)
    let innerIsSwitched = false
    if (TradeDocData.receiveUserUuid === uuid) {
      innerIsSwitched = true
      setIsSwitched(true)
      // console.log("setSwtiched", uuid)
    }
    if (TradeDocData.isCanceled) {
      deleteActiveTrade(tradeId)
      navigation.navigate("MainTrading")
      return
    }
    // console.log("isSwticed", innerIsSwitched, " ", TradeDocData.receiveUsername, " ", uuid)
    if (unchangingTradeData === undefined) {
      // TODO get profile photos from DB
      const sendProfilePhoto = (await getProfileDataFromDB(TradeDocData.sendUserUuid))?.profilePhoto || ""
      const receiveProfilePhoto = (await getProfileDataFromDB(TradeDocData.receiveUserUuid))?.profilePhoto || ""
      // const sendProfilePhoto = "http://cdn.shopify.com/s/files/1/0238/5301/collections/Teal-Lip.jpg?v=1643402323"
      // const receiveProfilePhoto = "https://surfd.com/wp-content/uploads/2021/12/Grossman-Feature-1.jpg"
      // first time getting data
      // console.log(TradeDocData.receiveUserUuid, " ", uuid)
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
      // flip the send and receive pins
      // console.log("Gere")
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
    // console.log("changing", changingTradeData)
  }

  const startInitial = async () => {
    const uuid = await _getUuid()
    // console.log(tradeId, "trade")
    const unsub = onSnapshot(doc(db, "active-trades", tradeId), (doc) => {
      // console.log("In snap")
      // check if its a local change
      if (doc.exists()) {
        // console.log("doc exits")
        handleTradeDocChanges(doc.data() as ActiveTradeType, uuid as string)
      }
      
    })
    return unsub
  }

  useEffect(() => {
    getPinsAndWorlds()
  let unsubFunc: any
    startInitial().then((unsub) => {
      unsubFunc = unsub
    })
    return () => {
      // cleanUpTrade()
      // unsubFunc()
    }
  }, [])

  const cleanUpTrade = async () => {
    await cancelActiveTrade(tradeId)
  }

//   useEffect(() => {
//     // console.log(changingTradeData, "changing")
//   }, [changingTradeData])

  const pinChoiceChange = async (pin: PinTypeDB) => {
    // TODO update DB with changing Data
    // TODO update UI with change
    // let isSwitchedLocal = false
    // console.log("isSqitec", isSwitched)

    if (!changingTradeData) return
    setSelectedPin(pin)
    setChangingTradeData({
      ...changingTradeData,
      sendPinSrc: pin.src,
      sendPinUuid: pin.uuid
    })
    let sendNewPin: any = {
      sendPinSrc: pin.src,
      sendPinUuid: pin.uuid
    }
    if (isSwitched) {
      sendNewPin = {
        receivePinSrc: pin.src,
        receivePinUuid: pin.uuid
      }
    }
    // console.log(sendNewPin, "New")
    await updateActiveTrade(tradeId, sendNewPin)
  }

  const handConfirmUnconfirm = async () => {
    // TODO update DB with changing Data
    if (!changingTradeData) return
    if (selectedPin === undefined) {
      alert("Please select a pin to trade")
      return
    }

    let sendData: any = {
      senderConfirmed: !changingTradeData.senderConfirmed
    }
    if (isSwitched) {
      sendData = {
        receiverConfirmed: !changingTradeData.senderConfirmed
      }
    }
    await updateActiveTrade(tradeId, sendData)
    // console.log("currentState", changingTradeData)

    setChangingTradeData({
      ...changingTradeData,
      senderConfirmed: !changingTradeData.senderConfirmed
    })

    return

  }

  const handleTradingCompleted = async () => {
    // print sender and receiver confirmed with labels
    // console.log("sender: ", changingTradeData?.senderConfirmed, "receiver: ", changingTradeData?.receiverConfirmed)
    if (changingTradeData?.senderConfirmed && changingTradeData.receiverConfirmed) {
      if (isFinished) return
      console.log("FINISHED")
      setIsFinished(true)
      // TODO update DB with changing Data
      // TODO update UI with change
      navigation.navigate("TradingCompleted", { tradeId: tradeId })
    }
    
  }
  // get the screen Dimension
    const screenHeight = Dimensions.get("window").height
    const screenWidth = Dimensions.get("window").width

  return (
    <ScreenWrapperComp scrollView>
      <OverallWrapper
        style={{ 
          height: screenHeight + (screenHeight * 0.4),
          width: screenWidth,
        }}
      >
        {unchangingTradeData && (
          <TopCardsWrapper>
            <TradingUserTopCard username={unchangingTradeData.sendUsername} userSrc={unchangingTradeData.sendProfilePhoto} key={unchangingTradeData.sendUsername}/>
            <TradingUserTopCard username={unchangingTradeData.receiveUsername} userSrc={unchangingTradeData.receiveProfilePhoto} key={unchangingTradeData.receiveUsername} />
          </TopCardsWrapper>
        )}
      {changingTradeData && (
        <CurrentPinChoicesWrapper>
          <CurrentPinChoiceCard pinSrc={selectedPin?.src || ""} isConfirmed={changingTradeData.senderConfirmed} />
          <SwapSvgWrapper>
            <Fontisto name="arrow-swap" size={50} color="#323232" />
          </SwapSvgWrapper>
          <CurrentPinChoiceCard pinSrc={changingTradeData.receivePinSrc} isConfirmed={changingTradeData.receiverConfirmed}  />
        </CurrentPinChoicesWrapper>
      )}
       
       {changingTradeData && (
        <ConfirmUnConfirmWrapper>
          <ConfirmUnConfirmButton isConfirmed={changingTradeData.senderConfirmed} isOtherUserConfirmed={changingTradeData.receiverConfirmed} handleClick={handConfirmUnconfirm} handleTradingCompleted={handleTradingCompleted} />
        </ConfirmUnConfirmWrapper>
       )}
       
       <PinsHeaderWrapper>
          <PinsHeader>Choose a Pin</PinsHeader>
          <Divider />
       </PinsHeaderWrapper>
       {(pinWorlds && usersPins) && (
        <PinsToChooseWrapper
        >
          {pinWorlds.map((world) => {
            const worldPins = usersPins.filter((pin) => pin.worldUuid === world.uuid)
            return <PinPickingSection key={world.uuid} isPinConfirmed={changingTradeData?.senderConfirmed || false} worldName={world.worldName} worldColor={world.worldColor} worldPins={worldPins} currentSelection={selectedPin || null} handleClick={pinChoiceChange} />
          })}
        </PinsToChooseWrapper>
       )}

       <CancelTradeButtonWrapper>
        <BasicButton style={{backgroundColor: logoutRed, borderColor: logoutRed, borderWidth: 2, height: 40, width: "98%"}} buttonTextStyle={{}} title="Cancel Trade" onPress={cleanUpTrade}/>
       </CancelTradeButtonWrapper>
        
      </OverallWrapper>
    </ScreenWrapperComp>
  )
}

export default TradingInProgressScreen