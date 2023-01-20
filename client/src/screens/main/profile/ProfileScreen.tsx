import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { AuthContext } from '../../../AppContext';
import BasicButton from '../../../shared/BasicButton';

const ProfileScreen: FC = () => {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View>
      <BasicButton title='Logout' onPress={() => {
          signOut();
      }}/>
    </View>
  )
}

export default ProfileScreen