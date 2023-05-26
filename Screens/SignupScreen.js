import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { Link } from "@react-navigation/native";
import axios from "axios";
import { useGlobalContext } from "../global/context";

const baseUrl = "http://172.16.120.26:8080/niperg-app-api/api.php?action=";
const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [hasEmailErr, setHasEmailErr] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const { isLoading, setIsLoading } = useGlobalContext();

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

  const signupHandler = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.post(
        `${baseUrl}save_user`,
        {
          name,
          email,
          password,
          phone,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );

      const { msg, status } = resp.data;

      if (status == 1) {
        Alert.alert(
          "Success",
          msg,
          [
            {
              text: "Close",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              // reset fields
              // setName("");
              // setEmail("");
              // setPhone("");
              // setPassword("");
            },
          }
        );
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
      } else if (status == 2) {
        Alert.alert(
          "Error",
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
      }
      setIsLoading(false);
    } catch (error) {}
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
        label="Name"
        value={name}
        style={styles.input}
        onChangeText={(name) => setName(name)}
      />
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
      <TextInput
        label="Phone Number"
        value={phone}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(phone) => setPhone(phone)}
      />
      <Button icon="account" mode="outlined" onPress={signupHandler}>
        {isLoading ? "Loading..." : "Register"}
      </Button>
      <Link
        style={{ marginBottom: 15, marginTop: 15 }}
        to={{ screen: "LoginScreen" }}
      >
        Already have an account ? SignIn
      </Link>
    </View>
  );
};

export default SignupScreen;

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
