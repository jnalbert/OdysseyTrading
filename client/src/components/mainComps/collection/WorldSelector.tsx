import React, { FC } from 'react'
import { View, Text } from 'react-native';
import styled from 'styled-components/native'
import { WorldsAttributesType } from '../../../screens/main/collection/MyCollectionScreen';
import { BlueGreen, GrandstanderSemiBold, Peach, Orange, Pink } from '../../../shared/colors';
import { WorldNameEnum } from '../../../shared/MiscTypes';
import MyCachedImage from '../../../shared/MyCachedImage';

const OverallWrapper = styled.View`
  width: 50%;
  height: 170%;
  background-color: ${Peach};
  border-radius: 100px;
  border: 1px solid black;
  /* justify-content: center; */
  align-items: center;
`;

const WorldText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 24px;
  color: ${BlueGreen};
  margin-top: 13%;
  /* margin-bottom: 15%; */
`
const WorldIconsWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 150%;
`


const WorldIconCircle = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 17.5px;
  background-color: ${BlueGreen};
  justify-content: center;
  align-items: center;
  /* border: 1px solid #000000; */
`

const WorldIcon = styled.Image`
  width: 20px;
  height: 20px;
`

interface Props {
  currentWorld: string;
  worldsInfo: WorldsAttributesType;
  handleWorldChange: (worldName: WorldNameEnum) => void;
}

const WorldSelector: FC<Props> = ({
  currentWorld,
  worldsInfo,
  handleWorldChange,
}) => {

  const EndTransforms = () => {
    return [{ translateY: 42 }]
  }
  const MiddleTransforms = (place: "left" | "right") => {
    const multiplier = place === "left" ? -1 : 1
    return [{ translateY: 13 }, { translateX: 5 * multiplier}]
  }

  

  const checkActive = (worldName: WorldNameEnum) => {
    const activeStyle = {backgroundColor: Orange, borderColor: Pink, borderWidth: 1}
    if (worldName === currentWorld) {
      return activeStyle
    } else {
      return {}
    }
  }

  return (
    <OverallWrapper style={{ 
      transform: [{ scaleX: 1.7}],
    }}>
      <WorldIconsWrapper
        style={{
          transform: [{ scaleX: 1/1.7 }],
        }}
        
      >
        <WorldIconCircle 
        style={[{
          transform: EndTransforms()
        }, checkActive(WorldNameEnum.DEEP_SEA)]}
        onPress={() => handleWorldChange(WorldNameEnum.DEEP_SEA)}
        >
          <MyCachedImage style={{width: 20, height: 20}} src="https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/newdeepseaicon.png" />
        </WorldIconCircle>
        <WorldIconCircle
          style={[{
            transform: MiddleTransforms("left")
          }, checkActive(WorldNameEnum.ENCHANTED_FOREST)]}
          onPress={() => handleWorldChange(WorldNameEnum.ENCHANTED_FOREST)}
        >
          <MyCachedImage style={{width: 20, height: 20}} src="https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/newencantedforesticon.png" />
        </WorldIconCircle>
        <WorldIconCircle
          style={[{
            transform: [{translateY: 5}]
          }, checkActive(WorldNameEnum.SEASONAL)]}
          onPress={() => handleWorldChange(WorldNameEnum.SEASONAL)}
        >
          <MyCachedImage style={{width: 20, height: 20}} src="https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/seasonalicon.png" />
        </WorldIconCircle>
        <WorldIconCircle
          style={[{
            transform: MiddleTransforms("right")
          }, checkActive(WorldNameEnum.COMING_SOON)]}
          onPress={() => handleWorldChange(WorldNameEnum.COMING_SOON)}
        >
          <MyCachedImage style={{width: 20, height: 20}} src="https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/comingSoonIcon.png" />
        </WorldIconCircle>
        <WorldIconCircle
          style={[{
            transform: EndTransforms()
          }, checkActive(WorldNameEnum.COMING_SOON)]}
          onPress={() => handleWorldChange(WorldNameEnum.COMING_SOON)}
        >
          <MyCachedImage style={{width: 20, height: 20}} src="https://storage.googleapis.com/odyssey-28652.appspot.com/world-icons/comingSoonIcon.png" />
        </WorldIconCircle>
      </WorldIconsWrapper>
      <WorldText
        style={{
          transform: [{ scaleX: 1/1.7 }],
        }}
        
      >WORLDS</WorldText>
    </OverallWrapper>
  )
}

export default WorldSelector