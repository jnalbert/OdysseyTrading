import React, { FC, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Peach, backgroundColor, Pink } from '../../shared/colors';
import ScreenWrapperComp from "../../shared/ScreenWrapperComp";
import Carousel from "react-native-reanimated-carousel";
import IntroCarouselCard from "../../components/authComps/IntroScreen/IntroCarouselCard";
import BasicButton from "../../shared/BasicButton";
import { useNavigation } from "@react-navigation/native";

const IntroScreenWrapper = styled.View`
  margin-top: 12%;
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const CarouselWrapper = styled.View`
    width: 100%;
`

const IntroImage = styled.Image`
  width: 100%;
`;

const GetStartedButtonWrapper = styled.View`
  width: 80%;
  display: flex;
  align-items: flex-end;
`

const IntroScreen: FC = () => {

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const [carouselSlidesData, setCarouselSlidesData] = useState<NodeRequire[]>([
        require("../../../assets/IntroCarousel/IntroSlide1.png"),
    ])
    const navigator: any = useNavigation();
    
    const handGetStarted = () => {
      navigator.navigate("SignInNav");
    }
  
  return (
    <ScreenWrapperComp noMargin backgroundColor={Peach}>
      <IntroScreenWrapper>
        {/* NEEEEDS TO BE CHANGED TODO */}
        <IntroImage source={require("../../../assets/IntroCarousel/OdysseyAppIntro.png")} />

        <CarouselWrapper>
            <Carousel
                loop
                width={width}
                height={height * 0.50}
                autoPlay={true}
                autoPlayInterval={3000}
                data={carouselSlidesData}
                scrollAnimationDuration={1000}
                overscrollEnabled={false}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={( imageSrc ) => (
                  <IntroCarouselCard imageSrc={imageSrc.item} />
                )}
            />
        </CarouselWrapper>
        <GetStartedButtonWrapper>
          <BasicButton title="Get Started!" buttonTextStyle={{color: Peach, fontSize: 28}} style={{width: 225, backgroundColor: Pink, height: 56}} onPress={handGetStarted}/>
        </GetStartedButtonWrapper>
      </IntroScreenWrapper>
    </ScreenWrapperComp>
  );
};

export default IntroScreen;
