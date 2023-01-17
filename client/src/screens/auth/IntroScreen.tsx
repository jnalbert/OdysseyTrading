import React, { FC, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Peach } from "../../shared/colors";
import ScreenWrapperComp from "../../shared/ScreenWrapperComp";
import Carousel from "react-native-reanimated-carousel";

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

const IntroScreen: FC = () => {

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    console.log(width, height * 0.55)
    const [carouselSlidesData, setCarouselSlidesData] = useState<string[]>([
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.pbs.org%2Fwnet%2Fnature%2Ffiles%2F2022%2F01%2FGAdUPy5-asset-mezzanine-16x9-fhYslY6.jpg&imgrefurl=https%3A%2F%2Fwww.pbs.org%2Fwnet%2Fnature%2Fgroup%2Famphibians-reptiles%2Fturtle-tortoise%2F&tbnid=prtL_xICpS9baM&vet=12ahUKEwixvuGzmc_8AhUuK0QIHX8pDwwQMygEegUIARDbAg..i&docid=QrdQY0J1kcPAYM&w=1920&h=1080&q=turtles%20pictures&ved=2ahUKEwixvuGzmc_8AhUuK0QIHX8pDwwQMygEegUIARDbAg",
    ])
  return (
    <ScreenWrapperComp noMargin backgroundColor={Peach}>
      <IntroScreenWrapper>
        {/* NEEEEDS TO BE CHANGED TODO */}
        <IntroImage source={require("../../../assets/OdysseyAppIntro.png")} />

        <CarouselWrapper>
            <Carousel
                loop
                width={width}
                height={height * 0.50}
                autoPlay={true}
                data={[...new Array(6).keys()]}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
        </CarouselWrapper>
      </IntroScreenWrapper>

    </ScreenWrapperComp>
  );
};

export default IntroScreen;
