import React, { FC, useState, useEffect } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { PastTrade } from '../../../screens/main/trading/MainTradingScreen';
import { GrandstanderExtraBold, MulishMedium, Text400 } from '../../../shared/colors';
import MyCachedImage from '../../../shared/MyCachedImage';
import { FontAwesome } from '@expo/vector-icons'; 
import { _getUuid } from '../../../AppContext';

const OverallCardWrapper = styled.View`
  width: 100%;
  background-color: #ffffff7d;
  height: 105px;
  flex-direction: row;
  justify-content: space-between;

`
const EndSectionsWrapper = styled.View`
  width: 42%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
const UserInformationWrapper = styled.View`
  flex-direction: column;
  /* height: 50%; */
  /* justify-content: space-between; */
  align-items: center;
`
const ProfilePhotoWrapper = styled.View`
  margin-bottom: 5%;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  margin-top: 2%;
  /* background-color: #dcd4d4; */
  overflow: hidden;
`
const UserNameText = styled.Text`
  margin-top: 10%;
  margin-bottom: 15%;
  font-family: ${MulishMedium};
  font-size: 12px;
  text-align: center;
  /* letter-spacing: -1px; */
`
const PinWrapper = styled.View`
  height: 60px;
  width: 60px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const MiddleSectionWrapper = styled.View`
  flex-direction: column;
  width: 16%;
  justify-content: center;
  align-items: center;
`
const DateText = styled.Text`
  font-family: ${MulishMedium};
  font-size: 12px;
  color: ${Text400};
  /* margin-top: 20%; */
  /* align-self: flex-start */
`


const PastTradeCard: FC<PastTrade> = ({
  tradeUuid,
  sendUserUuid,
  sendUserName,
  receiveUserName,
  receiveUserUuid,
  sendPinSrc,
  receivePinSrc,
  date,
}) => {
  // check if sendUserUuid === userUuid
  // if it does, then sendUserProfilePhoto = sendUserProfilePhoto
  // else sendUserProfilePhoto = receiveUserProfilePhoto
  const [displaySendInformation, setDisplaySendInformation] = useState({sendUserUuid: sendUserUuid, sendUserName: sendUserName, sendPinSrc: sendPinSrc})
  const [displayReceiveInformation, setDisplayReceiveInformation] = useState({receiveUserUuid: receiveUserUuid, receiveUserName: receiveUserName, receivePinSrc: receivePinSrc})

  const setCorrectData = async () => {
    const userUuid = await _getUuid()
    // console.log("userUuid: ", userUuid)
    if (userUuid === sendUserUuid) {
      setDisplaySendInformation({sendUserUuid: receiveUserUuid, sendUserName: receiveUserName, sendPinSrc: receivePinSrc})
      setDisplayReceiveInformation({receiveUserUuid: sendUserUuid, receiveUserName: sendUserName, receivePinSrc: sendPinSrc})
    }
  }
 
  const [sendUserProfilePhoto, setSendUserProfilePhoto] = useState<string>("");
  const [receiveUserProfilePhoto, setReceiveUserProfilePhoto] = useState<string>("");

  const getDisplayDate = () => {
    const dateNew = new Date(date);
    const shortYear = dateNew.getFullYear().toString().substr(2, 2);
    const localDate = dateNew.toLocaleDateString("en-US");

    return localDate.slice(0, localDate.length - 4) + shortYear;
  };

  const getInitalData = async () => {
    await setCorrectData()
    await getProfilePhotos()
  }
  const getProfilePhotos = async () => {
    // get profile photos from the database TODO *******
    setSendUserProfilePhoto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgJvMekGVb6Qvn6KAeBiDtds9JmdvtZqM0bg&usqp=CAU");
    setReceiveUserProfilePhoto("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d29vZHN8ZW58MHx8MHx8&w=1000&q=80");
  }

  useEffect(() => {
    getInitalData()
  }, []);

  return (
    <OverallCardWrapper>
      <EndSectionsWrapper>
        <UserInformationWrapper>
          <ProfilePhotoWrapper>
            {sendUserProfilePhoto && <MyCachedImage style={{width: "100%", height: "100%"}} src={sendUserProfilePhoto} />}
          </ProfilePhotoWrapper>
          <UserNameText
            numberOfLines={1}
          >@{displaySendInformation.sendUserName.substring(0,5)}...</UserNameText>
        </UserInformationWrapper>
        <PinWrapper
          style={{
            marginLeft: "11%",
          }}
        >
          <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode={"contain"} src={displaySendInformation.sendPinSrc}/>
        </PinWrapper>
      </EndSectionsWrapper>
        
      <MiddleSectionWrapper>
        <DateText
          style={{
            marginBottom: "30%",
          }}
        >{getDisplayDate()}</DateText>
        <FontAwesome style={{
          marginBottom: "30%",
        }} name="arrows-h" size={30} color="black" />
      </MiddleSectionWrapper>

      <EndSectionsWrapper>
      <PinWrapper
          style={{
            marginRight: "11%",
          }}
      >
          <MyCachedImage style={{width: "100%", height: "100%"}} resizeMode={"contain"} src={displayReceiveInformation.receivePinSrc}/>
        </PinWrapper>
        <UserInformationWrapper>
          <ProfilePhotoWrapper>
            {receiveUserProfilePhoto && <MyCachedImage style={{width: "100%", height: "100%"}} src={receiveUserProfilePhoto} />}
          </ProfilePhotoWrapper>
          <UserNameText
             numberOfLines={1}
          >@{displayReceiveInformation.receiveUserName.substring(0,5)}...</UserNameText>
        </UserInformationWrapper>
      </EndSectionsWrapper>
      
    </OverallCardWrapper>
  )
}

export default PastTradeCard