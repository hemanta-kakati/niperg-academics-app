import React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Button,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import SplashScreen from "./Screens/SplashScreen";
import LoginScreen from "./Screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./Screens/WelcomeScreen";
import FacultyRegisterScreen from "./Screens/FacultyRegisterScreen";
import SignupScreen from "./Screens/SignupScreen";
import { useGlobalContext } from "./global/context";

const Stack = createStackNavigator();

const Main = () => {
  const global = useGlobalContext();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const { isSplashScreen, isLogged } = global;

  console.log(global);

  const requestCameraPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        rationale: "We need your permission to access your camera.",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setHasCameraPermission(true);
    }
  };

  if (Platform.OS === "android") {
    requestCameraPermission();
  }

  const handleChangePermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        rationale: "We need your permission to access your camera.",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setHasCameraPermission(true);
    }
  };

  if (!hasCameraPermission) {
    return (
      <SafeAreaView>
        <View>
          <Text>
            You do not have camera permission. Please grant permission in the
            settings
          </Text>
          <Button title="Change Permission" onPress={handleChangePermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        >
          {isSplashScreen && (
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
            ></Stack.Screen>
          )}

          {isLogged ? (
            <>
              <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="FacultyRegister"
                component={FacultyRegisterScreen}
              ></Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
              ></Stack.Screen>
              <Stack.Screen
                name="SignupScreen"
                component={SignupScreen}
              ></Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Main;
