import React, { FC, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";
// @ts-ignore
import CachedImage from "expo-cached-image";
import { Black, BlueGreen } from './colors';
import sha256 from "crypto-js/sha256";

interface Props {
  src: string;
  style?: {};
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
}

const MyCachedImage: FC<Props> = ({ src, style, resizeMode }) => {
  // please sha-1 the src
  // make the src a cacheKey that doesnt hace non-alphanumeric characters
  // const regex = new RegExp(/[^a-zA-Z0-9]/g)
  // replace aoo non-alphanumeric characters with empty string
  //@ts-ignore
  const cacheKeyHash = sha256(src.replace(/[^a-zA-Z0-9]/g, "")).toString();
  // console.log(cacheKeyHash.toString());
  const [isChanging, setIsChanging] = useState(false);

  const [stateSrc, setStateSrc] = useState(src);
  // const cacheKey = src.replace(regex, '')

  return (
    <>
        <CachedImage
          source={{
            uri: stateSrc, // (required) -- URI of the image to be cached
            expiresIn: 1628288, // 1 month in seconds (optional), if not set -- will never expire and will be managed by the OS
          }}
          cacheKey={`${cacheKeyHash}-106`} // (required) -- key to store image locally
          placeholderContent={
            // (optional) -- shows while the image is loading
            <ActivityIndicator // can be any react-native tag
              color={Black}
              size="small"
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            />
          }
          style={style}
          resizeMode={resizeMode}
          key={cacheKeyHash}
        />
    </>
  );
};

export default MyCachedImage;
