import React, { FC, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Pink } from '../../shared/colors';

import { Feather } from '@expo/vector-icons';

interface Props { 
  onPress: () => void;
}

const ShowHideButton: FC<Props> = ({ onPress }) => {
  
  const showHidePress = () => {
    setText((text == "eye") ? "eye-off": "eye")
    onPress()
  }

  const [text, setText] = useState<"eye" | "eye-off">("eye")
  
  return (
    <View>
      <TouchableOpacity onPress={showHidePress}>
        <Feather name={text} size={18} color={Pink} />
      </TouchableOpacity>
    </View>
  )
}

export default ShowHideButton