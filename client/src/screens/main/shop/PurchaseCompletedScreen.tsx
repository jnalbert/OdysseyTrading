import React, { FC, useEffect } from 'react'
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native'
import ScreenWrapperComp from '../../../shared/ScreenWrapperComp';
import MyCachedImage from '../../../shared/MyCachedImage';
import { Black, BlueGreen, GrandstanderExtraBold, GrandstanderSemiBold, MulishMedium, Orange, Peach, Pink } from '../../../shared/colors';
import { Octicons } from '@expo/vector-icons'; 
import BasicButton from '../../../shared/BasicButton';
import { useIsFocused } from '@react-navigation/native';
import { addPinsToOpenToUserAccount } from '../../../../firebase/FirestoreFunctions';
import { _getUuid } from '../../../AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TopImageWrapper = styled.View`
  margin-top: 20%;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const CongratulationsText = styled.Text`
  font-family: ${GrandstanderExtraBold};
  color: ${BlueGreen};
  font-size: 30px;
  line-height: 28px;
  text-align: center;
  letter-spacing: 1px;
  margin-top: 8%;
`

const HatsOffWrapper = styled.View`
 width: 100%;
 justify-content: center;
 align-items: center;
 margin-top: 3%;
`

const PacksBoughtWrapper = styled.View`
  margin-top: 5%;
`

const IndividualPackWrapper = styled.View`
  flex-direction: row;
  justify-content: center;  
  width: 40%;
  margin: 2% 0;
`

const PackNameText = styled.Text`
  color: ${Orange};
  font-family: ${GrandstanderSemiBold};
  font-size: 28px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -1px;
  margin-right: 5%;
`

const QuantityText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  color: ${Black};
  font-size: 26px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -1px;
  margin-left: 5%;
`

const InformationBodyWrapper = styled.View`
  margin-top: 8%;
  width: 80%;
`

const BodyText = styled.Text`
  font-family: ${MulishMedium};
  color: ${Black};
  font-size: 16px;
  line-height: 40px;
  letter-spacing: -0.75px;
`

const ButtonToClickWrapper = styled.View`
  margin-top: 6%;
`
const IconToClickWrapper = styled.View`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: ${Pink};
  justify-content: center;
  align-items: center;
`

const BackToShopWrapper = styled.View`
  width: 80%;
  margin-top: 8%;
`

interface Props {
    navigation: any;
    route: any;
}

const PurchaseCompletedScreen: FC<Props> = ({
    navigation,
    route,
}) => {
    const {itemsBought} = route.params;

    const {height, width} = Dimensions.get('window');

    const handleBackToShopPress = () => {
      navigation.navigate('Shop')
    }

    const addPinsToUsersAccount = async () => {
      const uuid = await _getUuid()
      let pinsToAdd: number = 0
      itemsBought.forEach((item: any) => {
        const multiplier = item.pack
        pinsToAdd += (item.quantity * multiplier)
      })
      await addPinsToOpenToUserAccount(uuid || "", pinsToAdd)

    }
    const clearCart = async () => {
      await AsyncStorage.removeItem('cart')
      await AsyncStorage.removeItem('actualItemsBought')
    }
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = React.useState(false)
    useEffect(() => {
        // console.log("running use effect")
        if (hasInitiallyLoaded) return
      addPinsToUsersAccount()
      clearCart()
      setHasInitiallyLoaded(true)
    }, [])


    const isFocused = useIsFocused();

    useEffect(() => {
      if (hasInitiallyLoaded && !isFocused) {
        // navigation.navigate('Shop')
      }
    }, [isFocused])
  return (
    <ScreenWrapperComp scrollView>
      <TopImageWrapper style={{height: height * 0.2}}>
        <MyCachedImage src="https://storage.googleapis.com/odyssey-28652.appspot.com/pins/carnival/frank%20no%20pants-min.png" style={{ height: "100%", width: "100%" }}
          resizeMode="contain"/>
      </TopImageWrapper>

      <CongratulationsText>
        Congratulations!
      </CongratulationsText>
      <HatsOffWrapper>
        <BodyText>Hats off to you for purchasing with Odyssey Trading</BodyText>
      </HatsOffWrapper>
      <PacksBoughtWrapper>
        {itemsBought.map((item: any) => {
          return (
            <IndividualPackWrapper key={item.pack}>
              <PackNameText>{item.pack} pack:</PackNameText>
              <QuantityText>{item.quantity}x</QuantityText>
            </IndividualPackWrapper>
          )
        })}
      </PacksBoughtWrapper>
      <InformationBodyWrapper>
        <BodyText
          style={{lineHeight: 25, fontSize: 18, textAlign: 'center'}}
        >Now to collect your pins, go to the home screen and click the following icon in the top right corner</BodyText>
      </InformationBodyWrapper>
      <ButtonToClickWrapper>
        <IconToClickWrapper>
          <Octicons name="package" size={30} color="black" />
        </IconToClickWrapper>
      </ButtonToClickWrapper>
      <BackToShopWrapper>
      <BasicButton
            style={{
              width: "100%",
              borderRadius: 18,
              backgroundColor: Orange,
              borderColor: "black",
              borderWidth: 2,
              height: 56,
            }}
            buttonTextStyle={{ color: Peach, fontSize: 28 }}
            onPress={handleBackToShopPress}
            title="Back To Shop"
          />
      </BackToShopWrapper>
    </ScreenWrapperComp>
  )
}

export default PurchaseCompletedScreen