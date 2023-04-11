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
import {
  Black,
  GrandstanderExtraBold,
  GrandstanderMedium,
  GrandstanderSemiBold,
  Peach,
  Pink,
  Text400,
} from "../../../shared/colors";
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
import Constants from "expo-constants";

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

const BoundedBottomSection = styled.View`
  position: absolute;
  bottom: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 19%;
`;

const TopPricingInfoWrapper = styled.View`
  flex-direction: row;
  width: 101%;
  margin-bottom: 5%;
`;

const PricingSection = styled.View`
  flex-direction: row;
  width: 50%;
`;

const PricingTitle = styled.Text`
  font-family: ${GrandstanderMedium};
  font-size: 20px;
  color: rgba(0, 0, 0, 0.55);
`;

const PricingValue = styled.Text`
  margin-left: 3%;
  font-family: ${GrandstanderMedium};
  font-size: 20px;
  color: rgba(0, 0, 0, 0.8);
`;

const BottomPricingInfoWrapper = styled.View`
  height: 90%;
  width: 108%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TotalPrice = styled.Text`
  margin-top: 3%;
  /* margin-right: 25%; */
  font-family: ${GrandstanderSemiBold};
  font-size: 32px;
  color: #000000;
  margin-right: 3%;
`;

const CheckoutButtonWrapper = styled.View`
  margin-left: 8%;
`;

const NothingInCartTextWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const NothingInCartText = styled.Text`
  text-align: center;
  font-family: ${GrandstanderExtraBold};
  color: ${Text400};
  font-size: 16px;
  line-height: 20px;
`;

// for android to get the high of the window

interface RealPacksBoughtType {
  event: string;
  pack2: number;
  pack4: number;
  pack6: number;
}

const realPacksBoughtCallbackScript = ` 
  document
  .getElementById("id_checkout_btn")
  .addEventListener("click", () => {
    const keyValuePairs = [
      {
        key: "20.00",
        value: "pack2",
      },
      {
        key: "38.00",
        value: "pack4",
      },
      {
        key: "55.00",
        value: "pack6",
      },
    ];

    var packsBought = {
      pack2: 0,
      pack4: 0,
      pack6: 0,
    };
    const tableRows = document.getElementById("id_details_table").rows;
    for (let i = 1; i < tableRows.length; i++) {
      const row = tableRows[i];
      const possibleQuantityRow = row.getElementsByTagName("td")[2];
      if (!possibleQuantityRow) break;
      const qtyInput =
        possibleQuantityRow.getElementsByTagName("input")[0];
      if (!qtyInput) break;
      const possiblePriceElement =
        row.getElementsByClassName("text-right")[0];
      if (!possiblePriceElement) break;
      const price = possiblePriceElement.innerText;
      const value = qtyInput.value;
      const pack = keyValuePairs.find((pair) => pair.key === price);
      packsBought[pack.value] = value;
    }

    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        event: "realPacksBought",
        actualPacksBought: packsBought,
      })
    );
  });

  
`;
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

const CartScreen: FC<any> = ({ route, navigation }) => {
  // Modalize functions
  const modalizeRef = useRef<Modalize>(null);
  const webViewRef = useRef<WebView>(null);
  const [mounted, setMounted] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [layoutHeight, setLayoutHeight] = useState(initialHeight);
  const [documentHeight, setDocumentHeight] = useState(initialHeight);
  const height = isAndroid ? documentHeight : layoutHeight;
  const [subTotal, setSubTotal] = useState(0);

  const calculateSubTotal = (cartItems: SavedCartItem[]) => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setSubTotal(total);
  };

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

  const handleSendToPurchaseCompleted = () => {
    // const TESTING_TO_SEND = [
    //   { pack: 2, price: 20, quantity: 3 },
    //   { pack: 4, price: 38, quantity: 4 },
    //   { pack: 6, price: 55, quantity: 4 },
    // ];

    // CHANGE THISIIIIIIISISI********
    if (hasMadePurchase) return
    setHasMadePurchase(true);
    console.log("Purchased Everything");
    navigation.push("PurchaseCompleted", {
    itemsBought: actualPacksBought,
    });
    
    setCurrentCartData([]);
  };

  const [hasMadePurchase, setHasMadePurchase] = useState(false);

  const handleNavigationStateChange = useCallback(
    async ({ url, loading, navigationType }: WebViewNavigation) => {
      if (url.includes("/bankpaymentcompleted")) {
          if (!loading) {
            console.log("actual packs", actualPacksBought)
          }
          handleCloseWV();
          
          // handleSendToPurchaseCompleted()
      }
      console.log(url, loading)
      if (!loading && !navigationType && isAndroid) {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(documentHeightCallbackScript);
        }
      }
    },
    []
  );

  const handleChangeDocumentHeight = useCallback(
    (event: WebViewMessageEvent) => {
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
    },
    []
  );

  const [actualPacksBought, setActualPacksBought] = useState<SavedCartItem[]>(
    []
  );

  const handleUpdateRealPacksBought = useCallback(
    (realPacksBoughtData: any) => {
      // let newCartData = [{"pack": 2, "price": 20, "quantity": "2"}, {"pack": 4, "price": 38, "quantity": "4"}]
      let actualBoughtData: SavedCartItem[] = [{
        pack: 2,
        price: 20,
        quantity: realPacksBoughtData.actualPacksBought.pack2
      },
      {
        pack: 4,
        price: 38,
        quantity: realPacksBoughtData.actualPacksBought.pack4
      }, 
      {
        pack: 6,
        price: 55,
        quantity: realPacksBoughtData.actualPacksBought.pack6
      }
    ]
      actualBoughtData = actualBoughtData.filter((item) => item.quantity > 0);
      // console.log(newCartData)
      setActualPacksBought(actualBoughtData);
      console.log("Actual Packs Bought", actualBoughtData);
    },
    []
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (!data) {
      return;
    }
    if (data.event === "documentHeight") {
      handleChangeDocumentHeight(event);
    } else if (data.event === "realPacksBought") {
      handleUpdateRealPacksBought(data);
    }
  }, []);

  const handleLayout = ({ layout }: { layout: LayoutRectangle }) => {
    setLayoutHeight(layout.height);
  };

  const [currentCartData, setCurrentCartData] = useState<SavedCartItem[]>([]);

  const setInitialCartItems = async () => {
    // const cart = await getCartItems();
    let cart = route.params.cartItems;
    if (!cart) {
      cart = (await getCartItems()) || [];
    }
    setCurrentCartData(cart);
    calculateSubTotal(cart);
    // console.log("cartData", currentCartData);
    navigation.setParams({ cart: cart });
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      // console.log(currentCartData)
      saveItemsToCartStorage(currentCartData);
      // console.log("saving items")
    }
    if (isFocused) {
      setInitialCartItems();
      // console.log("gettting items")
    }
  }, [isFocused]);

  const startWebView = async () => {
    modalizeRef.current?.open();
    webViewRef.current?.stopLoading();
    const response = await loadAllPackUrls();
    if (response) {
      console.log(response);
      modalizeRef.current?.close();
      return;
    } else {
      console.log("successful");
      webViewRef.current?.reload();
    }
  };

  const loadAllPackUrls = async () => {
    const buyUrls: any = {
      "2pack":
        "https://portal.veinternational.org/buybuttons/us014300/btn/2-pack-0001/",
      "4pack":
        "https://portal.veinternational.org/buybuttons/us014300/btn/4-pack-0002/",
      "6pack":
        "https://portal.veinternational.org/buybuttons/us014300/btn/6-pack-0003/",
    };
    const fetchUrls: string[] = [];
    currentCartData.forEach((item: SavedCartItem) => {
      if (item.quantity > 0) {
        const buyUrlSearch = `${item.pack}pack`;
        for (let i = 0; i < item.quantity; i++) {
          fetchUrls.push(buyUrls[buyUrlSearch]);
        }
      }
    });
    console.log(fetchUrls);
    for (let i = 0; i < fetchUrls.length; i++) {
      try {
        await fetch(fetchUrls[i]);
      } catch (e) {
        alert(e);
        return e;
      }
    }
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
    startWebView();
  }

  const handleRemoveItems = (pack: number) => {
    // const newCartData: SavedCartItem[] = [];
    // for (let i = 0; i < currentCartData.length; i++) {
    //   if (currentCartData[i].pack !== pack) {
    //     newCartData.push(currentCartData[i]);
    //   }
    // }
    // // const newCartData = currentCartData.filter((item) => item.pack !== pack)
    // setCurrentCartData(newCartData);
    // calculateSubTotal(newCartData);
    // navigation.setParams({ cart: newCartData });
    // console.log(newCartData);
  };

  const handleChangeQuantity = (pack: number, quantity: number) => {
    // find the pack and then add the quantity
    const newCartData = currentCartData.map((item) => {
      if (item.pack === pack) {
        item.quantity += quantity;
      }
      return item;
    });

    // filters out any cart item that has quantity 0
    const filteredCart: SavedCartItem[] = [];
    for (let i = 0; i < newCartData.length; i++) {
      if (newCartData[i].quantity > 0) {
        filteredCart.push(currentCartData[i]);
      }
    }

    setCurrentCartData(filteredCart);
    calculateSubTotal(filteredCart);
    navigation.setParams({ cart: filteredCart });
  };

  return (
    <>
      <ScreenWrapperComp>
        <FlatList
          ListEmptyComponent={() => (
            <NothingInCartTextWrapper>
              <NothingInCartText>
                Nothing in your cart yet. Go buy some pins!
              </NothingInCartText>
            </NothingInCartTextWrapper>
          )}
          data={(currentCartData || [])
            .sort((a, b) => a.pack - b.pack)
            .filter((item) => item.quantity > 0)}
          keyExtractor={(item) => item.pack.toString()}
          renderItem={({ item, index }) => {
            if (item.quantity > 0) {
              return (
                <CartItem
                  pack={item.pack}
                  price={item.price}
                  quantity={item.quantity}
                  onRemove={handleRemoveItems}
                  onChangeQuantity={handleChangeQuantity}
                />
              );
            } else {
              return <></>;
            }
          }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          style={{ height: "55%", width: "95%", marginTop: "5%" }}
        ></FlatList>

        <BoundedBottomSection>
          <TopPricingInfoWrapper>
            <PricingSection>
              <PricingTitle>subtotal:</PricingTitle>
              <PricingValue>${subTotal}.00</PricingValue>
            </PricingSection>
            <PricingSection>
              <PricingTitle>shipping:</PricingTitle>
              <PricingValue>${subTotal ? 10 : 0}.00</PricingValue>
            </PricingSection>
          </TopPricingInfoWrapper>
          <BottomPricingInfoWrapper>
            <TotalPrice>${subTotal ? subTotal + 10 : 0}.00</TotalPrice>
            <CheckoutButtonWrapper>
              <BasicButton
                title="CHECK OUT"
                style={{
                  width: 180,
                  height: 50,
                  backgroundColor: Pink,
                  borderRadius: 34,
                }}
                buttonTextStyle={{
                  fontFamily: GrandstanderSemiBold,
                  fontSize: 22,
                  color: Peach,
                }}
                // onPress={handleBuyPress}
                onPress={handleBuyPress}
                border
                boxShadow
              />
            </CheckoutButtonWrapper>
          </BottomPricingInfoWrapper>
        </BoundedBottomSection>
      </ScreenWrapperComp>

      <Portal>
        <Modalize
          ref={modalizeRef}
          HeaderComponent={renderHeader()}
          onLayout={handleLayout}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          // make the modal not able to be dragged down
          panGestureEnabled={false}
          // modalHeight={height * 0.8}
          modalTopOffset={height * 0.07}
        >
          <WebView
            ref={webViewRef}
            source={{
              uri: "https://portal.veinternational.org/buybuttons/us014300/cart/",
            }}
            onLoadStart={() => {
              handleLoad("start");
            }}
            incognito={true}
            onLoadProgress={() => handleLoad("progress")}
            onLoadEnd={() => handleLoad("end")}
            sharedCookiesEnabled={true}
            cacheEnabled={true}
            onNavigationStateChange={handleNavigationStateChange}
            onMessage={handleMessage}
            startInLoadingState={true}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isAndroid}
            containerStyle={{ paddingBottom: 10 }}
            style={{ height }}
            injectedJavaScript={realPacksBoughtCallbackScript}
          />
        </Modalize>
      </Portal>
    </>
  );
};

export default CartScreen;
