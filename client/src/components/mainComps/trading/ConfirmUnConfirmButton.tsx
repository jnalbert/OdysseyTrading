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
  handleTradingCompleted: () => void;
}

const ConfirmUnConfirmButton: FC<Props> = ({
  isConfirmed,
  isOtherUserConfirmed,
  handleTradingCompleted,
  handleClick
}) => {
  const [buttonText, setButtonText] = useState(isConfirmed ? "Unconfirm Trade" : "Confirm Trade")
  const cancledRef = React.useRef(false)

  const confirmedStyles = isConfirmed ? {
    backgroundColor: Pink,
  } : {
    backgroundColor: "#2DDB29",
  }
  const handleFullyConfirmed = async () => {
    // sleep for 5 seconds
    // then call handleTradingCompleted
    // then setButtonText to "Trade Completed"
    // then setButtonTextCount to "Trade Completed"
    console.log("Gpot ere")
    // wait for the set timeout to finish
    await new Promise(resolve => setTimeout(resolve, 5000));
      if (!cancledRef.current) {
        handleTradingCompleted()
        setButtonText("Trade Completed")
        setButtonTextCount("Trade Completed")
      } else {
        console.log("cancled")
        cancledRef.current = false
      }
  }

  const [buttonTextCount, setButtonTextCount] = useState(`Trading in 5 Seconds...`)
  useEffect(() => {
    if (isConfirmed && isOtherUserConfirmed) {
      handleFullyConfirmed()
    }
  }, [isConfirmed, isOtherUserConfirmed])

  const width = Dimensions.get("window").width

  return (
    <OverallWrapper >
      <BasicButton style={[{width: width * 0.5}, confirmedStyles]} buttonTextStyle={{fontSize: 20, textAlign: "center"}} title={`${(isConfirmed && isOtherUserConfirmed) ? buttonTextCount: buttonText}`} onPress={() => {
        // setCountDown(0)
        cancledRef.current = false
        if (isConfirmed && isOtherUserConfirmed) {
          cancledRef.current = true
        }

        handleClick()
        }} />
    </OverallWrapper>
  )
}

export default ConfirmUnConfirmButton