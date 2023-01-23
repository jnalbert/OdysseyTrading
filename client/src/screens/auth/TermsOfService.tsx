import React, { FC } from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { Black, MulishMedium } from '../../shared/colors';
import ScreenWrapperComp from '../../shared/ScreenWrapperComp';

const OverallWrapper = styled.View`
  align-items: center;
  margin-top: 25px;
`

const BaggingText = styled.Text`
  font-family: ${MulishMedium};
  color: ${Black};
  font-size: 14px;

`

const NumberedText = styled.Text`
  font-family: ${MulishMedium};
  font-size: 12px;
  color: ${Black};
  margin-top: 10px;
  margin-bottom: 10px;
`

const TermsOfService: FC = () => {
  return (
    <ScreenWrapperComp scrollView>
    <OverallWrapper>
      <BaggingText>
          By registering as a new Odyssey customer and accessing the Odyssey platform or interacting with any of the Odyssey services,
          you agree to the following Odyssey Terms of Service, which we created to ensure the best possible experience for all of our customers.Any customer 
          found to be acting in violation of the codes may be blocked from purchasing from the company.Please conduct yourself responsibly and employ common-sense and 
          respect when participating in any Odyssey program or service. 
        </BaggingText>
        <BaggingText>
          By agreeing to Odyssey’s terms you hereby promise that you:
        </BaggingText>
        <NumberedText>
            Will not use the Services for any purpose that is illegal or prohibited in these Terms
            Will adhere to legal standards for plagiarism in regards to all Odyssey Products, such as Odyssey characters, or Odyssey creations.
            Will not use any robot, spider, crawler, scraper, or other automated means or interface to access the services or extract other customers’ private information.
            Will not use or develop any third-party applications that interact with the Services or other users’ content or information without our written consent.
            Will not upload anything to the Services which could damage or overburden them, these include
            Malware
            Malicious Code
            Other items considered harmful to the Services by Odyssey staff
            Will not attempt to avoid the Terms of any content-filtering techniques we employ, or attempt to access areas or features of the Services that you are not authorized to access.
            Will not encourage or promote any activity that violates these Terms.
        </NumberedText>

        <BaggingText>
          Failure to adhere to this Terms of Service impairs the integrity of our working environment and harms the value of Odyssey’s digital services for its customers.
          If Odyssey determines that you have violated this Terms of Service, it reserves the right to take any action it deems appropriate, including, but not limited to,
          restricting you from accessing Odyssey’s communication platforms or its gaming services, without refunds.
        </BaggingText>
      </OverallWrapper>
    </ScreenWrapperComp>
  )
}

export default TermsOfService