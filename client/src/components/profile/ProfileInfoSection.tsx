import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { BlueGreen, GrandstanderSemiBold, MulishMedium, Text500, Text300 } from '../../shared/colors';


const OverallWrapper = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  padding: 8px 0px;
  width: 100%;
`

const ValueWrapper = styled.View`
  width: 100%;
  height: 40px;
  margin: 10px 0px;
  padding-left: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${Text300};
  flex-direction: row;
  padding-right: 16px;
  align-items: center;
`

const ValueText = styled.Text`
  font-family: ${MulishMedium};
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -0.25px;
  color: ${Text500};
`

const HeaderText = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 16px;
  letter-spacing: -0.25px;
  color: ${BlueGreen};
  padding-left: 1px;
`

interface Props { 
  header: string;
  value: string;
}

const ProfileInfoSection: FC<Props> = ({header, value}) => {
  return (
    <OverallWrapper>
      <HeaderText>
        {header}
      </HeaderText>
      <ValueWrapper>
        <ValueText>
          {value}
        </ValueText>
      </ValueWrapper>
    </OverallWrapper>
  )
}

export default ProfileInfoSection