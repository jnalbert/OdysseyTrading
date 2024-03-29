import React, { FC, useState, useEffect } from "react";
import { Alert, Image, RefreshControl, View } from "react-native";
import styled from "styled-components/native";
import { UserDataType } from "../../../../firebase/types/UserType";
import { AuthContext, _getUuid } from "../../../AppContext";
import ProfileInfoSection from "../../../components/profile/ProfileInfoSection";
import BasicButton from "../../../shared/BasicButton";
import { BlueGreen, GrandstanderSemiBold, logoutRed, Peach, Text300, backgroundColor, Orange, borderColor, Black } from '../../../shared/colors';
import MyCachedImage from "../../../shared/MyCachedImage";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";
import { deleteAccount, getProfileDataFromDB } from '../../../../firebase/FirestoreFunctions';
import ActivityIndicatorWrapper from "../../../shared/ActivityIndicatorWrapper";
import { useIsFocused } from "@react-navigation/native";

const ProfilePhotoWrapper = styled.TouchableOpacity`
  border-radius: 65px;
  justify-content: center;
  align-items: center;
  height: 130px;
  width: 130px;
  margin-top: 2%;
  /* background-color: #dcd4d4; */
  overflow: hidden;
`

const ProfilePhoto = styled.Image`
  width: 100%;
  height: 100%;
`;

const ProfileHeaderWrapper = styled.View`
  flex-direction: column;
  align-items: flex-start;
  width: 96%;
  padding-top: 8%;
  border-bottom-color: ${Text300};
  border-bottom-width: 1.5px;
  padding-bottom: 7px;
`;

const ProfileHeader = styled.Text`
  font-family: ${GrandstanderSemiBold};
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.25px;
  color: ${BlueGreen};
`;

const InformationWrapper = styled.View`
  align-items: center;
  padding-top: 25px;
  width: 92%;
`;

const ChangePasswordWrapper = styled.View`
  width: 70%;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
`;

const LogoutButtonWrapper = styled.View`
  margin-top: 15%;
  width: 97%;
`;
const DeleteAccountButtonWrapper = styled.View`
  margin-top: 5%;
  margin-bottom: 5%;
  width: 97%;
`

interface UserInfoType {
  userName: string;
  name: string;
  email: string;
  dateJoined: string;
  totalPinsOwned: number;
  totalTradesMade: number;
  profilePhotoSrc: string;
}

const TestUserInfo: UserInfoType = {
  userName: "test",
  name: "Test User",
  email: "jnalbert879@Gmail.com",
  dateJoined: Date.now().toString(),
  totalPinsOwned: 0,
  totalTradesMade: 0,
  profilePhotoSrc:
    "https://firebasestorage.googleapis.com/v0/b/odyssey-28652.appspot.com/o/Pang%20in%20a%20flower.png?alt=media&token=5dc21ba1-0c99-4c71-a5f8-ee7e332ea68f",
};

const ProfileScreen: FC<any> = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const [profilePhotoSrc, setProfilePhotoSrc] = useState<string>("");

  const [userInfo, setUserInfo] = useState<UserDataType>({
    username: "",
    unopenedPinsCount: 0,
    name: "",
    email: "",
    dateJoined: "",
    totalPinsCollected: 0,
    totalTradesMade: 0,
    profilePhoto: "",
    bio: "",
    uuid: ""
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInitialData = async () => {
    // get data from api
    setIsRefreshing(true);
    const uuid = await _getUuid();
    const res = await getProfileDataFromDB(uuid || "");
    // const res = TestUserInfo;
    if (!res) return;

    const {
      username,
      name,
      email,
      dateJoined,
      totalPinsCollected,
      totalTradesMade,
      profilePhoto,
    } = res;

    const newDate = getFormattedDate(new Date(dateJoined).toString());

    setUserInfo({
      ...userInfo,
      username: username,
      name: name,
      email: email,
      dateJoined: newDate,
      totalPinsCollected: totalPinsCollected,
      totalTradesMade: totalTradesMade,
      profilePhoto: profilePhoto,
    });
    setProfilePhotoSrc(profilePhoto);
    // console.log("profilePhotoSrc: ", profilePhotoSrc)
    setIsRefreshing(false);
  };
  useEffect(() => {
    fetchInitialData();
  }, []);

  const getFormattedDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleLogout = () => {
    signOut();
  };

  const handleDeleteAccount = async () => {
    const uuid = await _getUuid();
    console.log("delete account")
    await deleteAccount(uuid as string);
    signOut()
  };

  const deleteAccountAlert = () => {
    Alert.alert(
      "Are you sure?",
      "This will permanently delete your account and it will not be recoverable",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            handleDeleteAccount();
          },
          style: "destructive",
        },
      ]
    );
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    fetchInitialData()
  }, [isFocused]);

  return (
    <ScreenWrapperComp backgroundColor={Peach} isScreenProtected scrollView refreshControl={
      <RefreshControl
      refreshing={isRefreshing}
      onRefresh={async () => await fetchInitialData()}
      />
    }>
        <ProfilePhotoWrapper>
            <ActivityIndicatorWrapper isLoading={isRefreshing} >
                <MyCachedImage style={{width: "100%", height: "100%"}} src={profilePhotoSrc} key="profilePic" />
                {/* <Image style={{width: "100%", height: "100%"}} source={{uri: profilePhotoSrc}} key="profilePic" /> */}
            </ActivityIndicatorWrapper>
        </ProfilePhotoWrapper>

      <ProfileHeaderWrapper>
        <ProfileHeader>Profile Information</ProfileHeader>
      </ProfileHeaderWrapper>

      <InformationWrapper>
        <ProfileInfoSection header="User Name" value={userInfo.username} />
        <ProfileInfoSection header="Name" value={userInfo.name} />
        <ProfileInfoSection header="Email" value={userInfo.email} />
        <ProfileInfoSection header="Date Joined" value={userInfo.dateJoined}/>
        <ProfileInfoSection header="Total Pins Owned" value={userInfo.totalPinsCollected.toString()}/>
        <ProfileInfoSection header="Total Trades Made" value={userInfo.totalTradesMade.toString()}/>
      </InformationWrapper>

      <ChangePasswordWrapper>
        <BasicButton style={{width: "100%", borderRadius: 18, backgroundColor: Orange, borderColor: "black", borderWidth: 2}} buttonTextStyle={{color: Peach, fontSize: 18}} onPress={handleChangePassword} title='Change Password' />
      </ChangePasswordWrapper>

      <LogoutButtonWrapper>
        <BasicButton style={{backgroundColor: "transparent", borderColor: logoutRed, borderWidth: 2, height: 56, width: "98%" }}  buttonTextStyle={{color: logoutRed}} title="Sign Out" onPress={handleLogout}/>
      </LogoutButtonWrapper>

      <DeleteAccountButtonWrapper>
        <BasicButton style={{backgroundColor: logoutRed, borderColor: logoutRed, borderWidth: 2, height: 56, width: "98%"}} buttonTextStyle={{}} title="Delete Your Account" onPress={deleteAccountAlert}/>
      </DeleteAccountButtonWrapper>
      
    </ScreenWrapperComp>
  )
};

export default ProfileScreen;
