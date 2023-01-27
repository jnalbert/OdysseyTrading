import React, { FC } from 'react'
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native'
// @ts-ignore
import CachedImage from 'expo-cached-image'
import { Black } from './colors';

interface Props {
  src: string;
  style?: {};
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
}

const MyCachedImage: FC<Props> = ({
  src,
  style,
  resizeMode
}) => {
  // please sha-1 the src
  // make the src a cacheKey that doesnt hace non-alphanumeric characters
  const regex = new RegExp(/[^a-zA-Z0-9]/g)
  //@ts-ignore
  const cacheKey = src.replace(regex, '')

  return (
    <CachedImage
          source={{ 
            uri: src, // (required) -- URI of the image to be cached         
            expiresIn: 1_628_288, // 1 month in seconds (optional), if not set -- will never expire and will be managed by the OS
          }}
          cacheKey={`${cacheKey}`} // (required) -- key to store image locally
          placeholderContent={( // (optional) -- shows while the image is loading
            <ActivityIndicator // can be any react-native tag
              color={
                Black
              }
              size="small"
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            />
          )} 
          style={style}
          resizeMode={resizeMode}
        />
  )
}

export default MyCachedImage