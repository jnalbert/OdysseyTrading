import "dotenv/config";

export default {
  expo: {
    name: "Odyssey Trading",
    slug: "odyssey-trading",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/LogoSmall.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/LogoLargeV2.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.jnalbert879.odysseytrading",
      buildNumber: "1.0.0",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/LogoSmall.png",
        backgroundColor: "#FFFFFF"
      },
    },
    web: {
      favicon: "./assets/LogoSmall.png",
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to use as a profile picture.",
        },
      ],
    ],
    extra: {
      eas: {
        "projectId": "b2812455-c16f-4e6f-8d07-2a0ae16b994b"
      },
        firebaseApiKey: process.env.FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.FIREBASE_APP_ID,
        firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      }
  },
};
