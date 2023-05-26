import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Button } from "react-native-paper";
import { useGlobalContext } from "../global/context";


const WelcomeScreen = ({ navigation, route }) => {
  // const [userName, setUserName] = useState("");
  // const [userName1, setUserName1] = useState("Suman");

  const {setIsLogged, userState, setIsLoading, isLoading} = useGlobalContext();  

  const signOut = () => {
    setIsLoading(true);
    SecureStore.deleteItemAsync("user_data").then((res) => {
      console.log("setting isLogged to false");
      setIsLogged(false);
    });
    setIsLogged(false);
    setIsLoading(false);
  };

  return (
    <View>
      <Text style={styles.heading}>Welcome to NIPERG </Text>
      <Text style={styles.lead}>{userState.name.toUpperCase()}</Text>
      <Text style={styles.lead}>Your Email: {userState.email}</Text>
      <Text style={styles.lead}>Your PhoneNo: {userState.phone}</Text>
      <Button icon="camera" mode="contained" onPress={() => signOut()} >
          {isLoading ? "Loading..." : "Logout"}
      </Button>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10
  },
  lead: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10
  }
});
