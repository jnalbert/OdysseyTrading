import { BlurView } from 'expo-blur';
import React, { FC, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import BasicButton from './BasicButton';
import { GrandstanderSemiBold, MulishMedium, Orange, Peach, Text400, Text500 } from './colors';


const WordsWrapper = styled.View`
  height: 268px;
  width: 343px;
  flex-direction: column;
  align-items: center;
  background-color: ${Peach};
  border-radius: 8px;
`

const Header = styled.Text`
  padding: 10px;
  font-family: ${MulishMedium};
  font-size: 32px;
  line-height: 40px;

  text-align: center;
  letter-spacing: -1.5px;
  color: ${Text500};
  padding-top: 30px;
`
const SubHeading = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.25px;
  color: ${Text400};
  padding-top: 15px;
`

const ButtonWrapper = styled.View`
  padding-top: 35px;
  width: 60%;
`
interface Props {
  visible: boolean;
  title: string;
  subheading: string;
  buttonTitle: string;
  buttonOnPress: () => void;
}

const ActionCompletedSection: FC<Props> = ({ visible, title, subheading, buttonTitle, buttonOnPress }) => {
  
  const [isVisible, setIsVisible] = useState(visible);
  
  const handleOnPress = () => {
    buttonOnPress();
    // navigation.navigate("AudioFiles")
    setIsVisible(false);
  }


  
  return (
    <Modal
    animationType="fade"
    presentationStyle="overFullScreen"
    transparent={true}
    visible={isVisible}
  >
    <BlurView intensity={80} tint="light" style={[StyleSheet.absoluteFill, {alignItems: "center", justifyContent:"center"}]}>
      <WordsWrapper>
        <Header>
          {title}
        </Header>

        <SubHeading>
          {subheading}
        </SubHeading>

        
        <ButtonWrapper>
          <BasicButton style={{width: "100%", borderRadius: 18, backgroundColor: Orange, borderColor: "black", borderWidth: 2}} buttonTextStyle={{color: Peach}} title={buttonTitle} onPress={handleOnPress}/>
        </ButtonWrapper>
        
      </WordsWrapper>
      
    </BlurView>
  </Modal>
  )
}

export default ActionCompletedSection