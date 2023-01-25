import React, { FC, useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native'
import BasicButton from '../../../shared/BasicButton';
import { Pink } from '../../../shared/colors';

const OverallWrapper = styled.View`
  width: 80%;
  /* background-color: red; */
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
`
interface Props {
  isConfirmed: boolean;
  isOtherUserConfirmed: boolean;
  handleClick: () => void;
}

const ConfirmUnConfirmButton: FC<Props> = ({
  isConfirmed,
  isOtherUserConfirmed,
  handleClick
}) => {
  const [buttonText, setButtonText] = useState(isConfirmed ? "Unconfirm Trade" : "Confirm Trade")

  const confirmedStyles = isConfirmed ? {
    backgroundColor: Pink,
  } : {
    backgroundColor: "#2DDB29",
  }

  const [buttonTextCount, setButtonTextCount] = useState(`Trading in 5 Seconds...`)

  const width = Dimensions.get("window").width

  return (
    <OverallWrapper >
      <BasicButton style={[{width: width * 0.5}, confirmedStyles]} buttonTextStyle={{fontSize: 20, textAlign: "center"}} title={`${(isConfirmed && isOtherUserConfirmed) ? buttonTextCount: buttonText}`} onPress={() => {
        // setCountDown(0)
        handleClick()
        }} />
    </OverallWrapper>
  )
}

export default ConfirmUnConfirmButton