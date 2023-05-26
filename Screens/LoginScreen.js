import { StyleSheet, View, Text, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { Link } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useGlobalContext } from "../global/context";

const baseUrl = "http://172.16.120.26:8080/niperg-app-api/api.php?action=";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const Login = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [hasEmailErr, setHasEmailErr] = useState(false);
  const [password, setPassword] = useState("");
  // const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const { setIsLogged, isLoading, setIsLoading, setUserState } =
    useGlobalContext();

  const validateEmail = (val) => {
    if (val && val.match(isValidEmail)) {
      setHasEmailErr(false);
    } else {
      setHasEmailErr(true);
    }
  };

  useEffect(() => {
    validateEmail(email);
  }, [email]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.post(
        `${baseUrl}login_user`,
        {
          email,
          password,
        },

        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const { status, msg, payload } = resp.data;
      if (status == 2) {
        setEmail("");
        setPassword("");
        Alert.alert(
          "Authentication failed",
          msg,
          [
            {
              text: "Close",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {},
          }
        );
      } else if (status == 1) {
        if (payload) {
          save(
            "user_data",
            JSON.stringify({
              id: payload.login_id,
              name: payload.login_name,
              email: payload.login_email,
              phone: payload.login_phone,
            })
          );
          // save("user_name", payload.login_name);
          // save("user_email", payload.login_email);
          // save("user_phone", payload.login_phone);
          setUserState({
            id: payload.login_id,
            name: payload.login_name,
            email: payload.login_email,
            phone: payload.login_phone,
          });

          setIsLogged(true);
          navigation.navigate("WelcomeScreen");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.body}>
      <View style={{ marginBottom: 20, marginTop: 20 }}>
        <Image
          source={require("../assets/niperg-logo-medium.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <TextInput
        label="Email"
        value={email}
        style={styles.input}
        onChangeText={(email) => setEmail(email)}
        error={hasEmailErr}
      />
      <TextInput
        label="Password"
        value={password}
        style={styles.input}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry
      />
      <Button icon="account" mode="outlined" onPress={handleLogin}>
        {!isLoading ? "Login" : "Loading"}
      </Button>
      <Text style={{ marginBottom: 15, marginTop: 15 }}>
        Don't have an account?{" "}
        <Button
          onPress={() => {
            navigation.navigate("SignupScreen");
          }}
        >
          Sign UP
        </Button>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    justifyContent: "center",
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 15,
  },
  image: {
    width: 150,
    height: 150,
    alignItems: "center",
  },
});

export default Login;
