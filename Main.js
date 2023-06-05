import { View, Text } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
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

  const { isSplashScreen, isLogged } = global;

  console.log(global);

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
