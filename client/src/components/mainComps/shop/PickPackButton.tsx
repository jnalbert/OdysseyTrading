import React, { FC } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { BlueGreen, GrandstanderMedium, Orange, Peach, borderColor } from '../../../shared/colors';

const PackButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding-left: 3px;
  padding-top: 3px;
  width: 55px;
  height: 55px;
  border-radius: 27.5px;
  background: ${BlueGreen};
  border: 2px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
const PackText = styled.Text`
  font-family: ${GrandstanderMedium};
  font-size: 32px;
  color: ${Peach};
`;

interface PickPackButtonProps {
  pack: number;
  currentPack: number;
  handlePackPress: (pack: number) => void;
}

const PickPackButton: FC<PickPackButtonProps> = ({
  pack,
  currentPack,
  handlePackPress,
}) => {
  
  const packButtonStyles = currentPack === pack ? { backgroundColor: Peach, borderColor: Orange } : {};
  const packTextStyles = currentPack === pack ? { color: Orange } : {};
  return (
    <PackButton style={[packButtonStyles]} onPress={() => handlePackPress(pack)}>
      <PackText style={[packTextStyles]}>{pack}</PackText>
    </PackButton>
  );
};

export default PickPackButton;
