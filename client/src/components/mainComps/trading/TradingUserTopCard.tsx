import React, { FC } from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";
import { Black, GrandstanderSemiBold } from "../../../shared/colors";
import MyCachedImage from "../../../shared/MyCachedImage";

const OverallWrapper = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
`;
const ProfileWrapper = styled.View`
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
  margin-top: 2%;
  /* background-color: #dcd4d4; */
  overflow: hidden;
`;

const UserNameText = styled.Text`
  margin-top: 12%;
  font-family: ${GrandstanderSemiBold};
  font-size: 15px;
  color: ${Black};
`;

interface Props {
  username: string;
  userSrc: string;
}

const TradingUserTopCard: FC<Props> = ({ username, userSrc }) => {
//   console.log("Here", userSrc);
  return (
    <OverallWrapper>
      <ProfileWrapper>
        {userSrc === "" ? (
          <></>
        ) : (
          <MyCachedImage
            style={{ height: "100%", width: "100%" }}
            src={userSrc}
          />
        )}
        {/* <Image style={{height: "100%", width: "100%"}} source={{uri: userSrc}} /> */}
      </ProfileWrapper>
      <UserNameText>@{username}</UserNameText>
    </OverallWrapper>
  );
};

export default TradingUserTopCard;
