import React, { FC, useState, useEffect } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { Octicons } from '@expo/vector-icons'; 
import { MulishMedium, Pink } from '../../../shared/colors';

const OverAllWrapper = styled.View`
  /* height: 50px;
  width: 50px; */
  margin-left: 45%;
  /* background-color: red; */
  
`

const NotificationWrapper = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${Pink};
  justify-content: center;
  align-items: center;
`

interface Props {
  notification: boolean;
  navigation: any;
}

const HeaderNewPinNotification: FC<Props> = ({
  notification,
  navigation
}) => {

  const [notificationState, setNotificationState] = useState(false)

  useEffect(() => {
    setNotificationState(notification)
  }, [notification])

  
  const handleNotificationPress = () => {
    navigation.setParams({ newPinNotifications: false })
    navigation.navigate('OpenPacks')
    console.log('notification pressed')
  }

  if (!notificationState) return <></>

  return (
    <OverAllWrapper>
      <NotificationWrapper onPress={handleNotificationPress}>
        <Octicons name="package" size={24} color="black" />
      </NotificationWrapper>
    </OverAllWrapper>
  )
}

export default HeaderNewPinNotification