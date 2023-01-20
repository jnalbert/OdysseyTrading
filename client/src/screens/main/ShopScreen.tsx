import React, { FC } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import DisplayPinSlider from "../../components/mainComps/shop/DisplayPinSlider";
import PickPackButton from "../../components/mainComps/shop/PickPackButton";
import { BlueGreen, GrandstanderMedium, MulishMedium, Peach } from "../../shared/colors";
import ScreenWrapperComp from "../../shared/ScreenWrapperComp";

const PinSliderWrapper = styled.View`
  /* height: 100%; */
  width: 100%;
`;

const PacksPickerWrapper = styled.View`
  padding: 15px;
  margin-top: 11%;
  height: 160px;
  width: 101%;
  background-color: ${BlueGreen};
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  border: 2px solid #000000;
`;

const PacksHeaderText = styled.Text`
  font-family: ${GrandstanderMedium};
  font-size: 34px;
  color: ${Peach};
`;
const PacksButtonsWrapper = styled.View`
  margin-top: 3%;
  flex-direction: row;
  width: 85%;
  justify-content: space-between;
`;


const RandomTextWrapper = styled.View`
  margin-top: 4%;
  width: 100%;
  align-items: flex-start;
`

const RandomText = styled.Text`
  font-family: ${MulishMedium};
  color: ${Peach};
  text-align: left;
`;

const BuyingSectionWrapper = styled.View`

`;

const PriceText = styled.Text`

`;

const ShopScreen: FC = () => {
  const [currentPack, setCurrentPack] = React.useState(2);

  const handlePackPress = (pack: number) => {
    setCurrentPack(pack);
  }

  return (
    <ScreenWrapperComp backgroundColor={Peach} scrollView noMargin>
      <PinSliderWrapper>
        <DisplayPinSlider />
      </PinSliderWrapper>

      <PacksPickerWrapper>
        <PacksHeaderText>Packs</PacksHeaderText>
        <PacksButtonsWrapper>
          <PickPackButton pack={2} currentPack={currentPack} handlePackPress={handlePackPress} />
          <PickPackButton pack={4} currentPack={currentPack} handlePackPress={handlePackPress} />
          <PickPackButton pack={6} currentPack={currentPack} handlePackPress={handlePackPress} />
        </PacksButtonsWrapper>
        <RandomTextWrapper>
          <RandomText>*pins in packs are picked randomly</RandomText>
        </RandomTextWrapper>
      </PacksPickerWrapper>
    </ScreenWrapperComp>
  );
};

export default ShopScreen;
