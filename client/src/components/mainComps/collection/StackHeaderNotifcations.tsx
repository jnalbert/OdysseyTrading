import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { GrandstanderSemiBold, Peach } from '../../../shared/colors';


const HeaderContainer = styled.View`
  height: 88px;
  padding-top: 35px;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  background-color: ${Peach};
`

const HeaderText = styled.Text`
  font-size: 20px;
  font-family: ${GrandstanderSemiBold};
  /* line-height: 28px; */
  text-align: center;
  /* letter-spacing: -1px; */
`
const NotificationContainer = styled.View`
  align-self: end;
`

interface StackHeaderNotificationsProps {
  name: string;
  showNotification: boolean;
}

const StackHeaderNotifications: FC<StackHeaderNotificationsProps> = ({name, showNotification}) => {
  return (
    <HeaderContainer>
      <HeaderText>{name}</HeaderText> 
      <NotificationContainer>
        {/* {showNotification && <HeaderNewPinNotification/> } */}
      </NotificationContainer>
    </HeaderContainer>
  )
}

export default StackHeaderNotifications