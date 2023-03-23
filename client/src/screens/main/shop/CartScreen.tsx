import React, { FC, useCallback, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  LayoutRectangle,
  Animated,
  Platform,
  Easing,
  FlatList,
} from "react-native";
import styled from "styled-components/native";
import BasicButton from "../../../shared/BasicButton";
import { GrandstanderSemiBold, Orange, Peach } from "../../../shared/colors";
import ScreenWrapperComp from "../../../shared/ScreenWrapperComp";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import {
  getCartItems,
  SavedCartItem,
  saveItemsToCartStorage,
} from "./ShopScreen";
import CartItem from "../../../components/mainComps/shop/CartItem";

const { width, height: initialHeight } = Dimensions.get("window");
const isAndroid = Platform.OS === "android";

const WebViewHeader = styled.View`
  height: 44px;
  border-bottom-color: #c1c4c7;
  border-bottom-width: 1px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
`;

const WebViewHeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
  z-index: 2;
  padding-left: 12px;
  padding-right: 12px;
  height: 100%;
`;

const CloseButtonWrapper = styled.TouchableOpacity`
  height: 20px;
  width: 10%;
  /* padding-right: auto; */
  /* margin-right: 25; */
`;

const WebViewHeaderCenterWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 83%;
  /* margin-left: auto; */
`;

const WebViewHeaderUrl = styled.Text`
  margin-left: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #31a14c;
`;

// for android to get the high of the window
const documentHeightCallbackScript = `
  function onElementHeightChange(elm, callback) {
    var lastHeight;
    var newHeight;
    (function run() {
      newHeight = Math.max(elm.clientHeight, elm.scrollHeight);
      if (lastHeight != newHeight) {
        callback(newHeight);
      }
      lastHeight = newHeight;
      if (elm.onElementHeightChangeTimer) {
        clearTimeout(elm.onElementHeightChangeTimer);
      }
      elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
  }
  onElementHeightChange(document.body, function (height) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        event: 'documentHeight',
        documentHeight: height,
      }),
    );
  });
`;

const CartScreen: FC<any> = ({ route }) => {
  // Modalize functions
  const modalizeRef = useRef<Modalize>(null);
  const webViewRef = useRef<WebView>(null);
  const [mounted, setMounted] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [layoutHeight, setLayoutHeight] = useState(initialHeight);
  const [documentHeight, setDocumentHeight] = useState(initialHeight);
  const height = isAndroid ? documentHeight : layoutHeight;

  const handleCloseWV = () => {
    modalizeRef.current?.close();
  };

  const handleLoad = (status: "start" | "progress" | "end") => {
    setMounted(true);
    if (status === "progress" && !mounted) {
      return;
    }

    const toValue = status === "start" ? 0.2 : status === "progress" ? 0.5 : 1;
    Animated.timing(progress, {
      toValue,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    if (status === "end") {
      Animated.timing(progress, {
        toValue: 2,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => {
        progress.setValue(0);
      });
    }
  };

  const handleNavigationStateChange = useCallback(
    async ({ url, loading, navigationType }: WebViewNavigation) => {
      if (url.includes("/bankpaymentcompleted")) {
        setTimeout(() => {
          handleCloseWV();
          // I Have TO IMPLEMENT THIS TODO
          // ******
          // navigation.navigate("PurchaseCompleted");
        }, 1000);
      }
      if (!loading && !navigationType && isAndroid) {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(documentHeightCallbackScript);
        }
      }
    },
    []
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    if (!isAndroid) {
      return;
    }
    const data = JSON.parse(event.nativeEvent.data);
    if (!data) {
      return;
    }
    switch (data.event) {
      case "documentHeight": {
        if (data.documentHeight !== 0) {
          setDocumentHeight(data.documentHeight);
        }
        break;
      }
    }
  }, []);

  const handleLayout = ({ layout }: { layout: LayoutRectangle }) => {
    setLayoutHeight(layout.height);
  };

  const [currentCartData, setCurrentCartData] = useState<SavedCartItem[]>([]);
  const [currentLoadingIndex, setCurrentLoadingIndex] = useState(0);

  const setInitialCartItems = async () => {
    // const cart = await getCartItems();
    let cart = route.params.cartItems;
    if (!cart) {
      cart = (await getCartItems()) || [];
    }
    setCurrentCartData(cart);
    console.log("cartData", currentCartData);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      saveItemsToCartStorage(currentCartData);
      // console.log("saving items")
    }
    if (isFocused) {
      setInitialCartItems();
      // console.log("gettting items")
    }
  }, [isFocused]);

  const onPageLoadEnd = () => {
    // if all of the tab loading is done, then call the done function
  };

  const renderHeader = () => {
    return (
      <WebViewHeader>
        <WebViewHeaderWrapper>
          <CloseButtonWrapper onPress={handleCloseWV} activeOpacity={0.75}>
            <AntDesign name="close" size={22} color="black" />
          </CloseButtonWrapper>

          <WebViewHeaderCenterWrapper>
            <FontAwesome name="lock" size={16} color="#31a14c" />
            <WebViewHeaderUrl numberOfLines={1}>
              veinternational.org
            </WebViewHeaderUrl>
          </WebViewHeaderCenterWrapper>
        </WebViewHeaderWrapper>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "#eeeef0",
              opacity: 0,
              transform: [
                {
                  translateX: -width,
                },
              ],
            },
            {
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 0.2, 0.5, 1, 2],
                    outputRange: [-width, -width + 80, -width + 220, 0, 0],
                  }),
                },
              ],
              opacity: progress.interpolate({
                inputRange: [0, 0.1, 1, 2],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      </WebViewHeader>
    );
  };

  function handleBuyPress(): void {
    modalizeRef.current?.open();
  }

  const handleRemoveItems = (pack: number) => {};

  const handleChangeQuantity = (pack: number, quantity: number) => {};

  return (
    <>
      <ScreenWrapperComp>
        <FlatList
          data={currentCartData}
          keyExtractor={(item) => item.pack.toString()}
          renderItem={({ item, index }) => (
            <CartItem
              pack={item.pack}
              price={item.price}
              quantity={item.quantity}
              onRemove={handleRemoveItems}
              onChangeQuantity={handleChangeQuantity}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          style={{ height: "55%", width: "95%" }}
        ></FlatList>

        <BasicButton
          title="BUY"
          style={{
            width: 165,
            height: 65,
            backgroundColor: Orange,
            borderRadius: 18,
          }}
          buttonTextStyle={{
            fontFamily: GrandstanderSemiBold,
            fontSize: 42,
            color: Peach,
          }}
          onPress={handleBuyPress}
          border
          boxShadow
        />
      </ScreenWrapperComp>

      <Portal>
        <Modalize
          ref={modalizeRef}
          HeaderComponent={renderHeader()}
          onLayout={handleLayout}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          // make the modal not able to be dragged down
          panGestureEnabled={false}
        >
          <WebView
            ref={webViewRef}
            source={{ uri: "https://odyssey-vei.com/" }}
            onLoadStart={() => handleLoad("start")}
            onLoadProgress={() => handleLoad("progress")}
            onLoadEnd={() => handleLoad("end")}
            onNavigationStateChange={handleNavigationStateChange}
            onMessage={handleMessage}
            startInLoadingState={true}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isAndroid}
            containerStyle={{ paddingBottom: 10 }}
            style={{ height }}
          />
        </Modalize>
      </Portal>
    </>
  );
};

export default CartScreen;
