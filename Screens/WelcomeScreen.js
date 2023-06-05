import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Button as ButtonRP } from "react-native-paper";
import { useGlobalContext } from "../global/context";
import DocumentScanner from "react-native-document-scanner-plugin";

const WelcomeScreen = ({ navigation, route }) => {
  const { setIsLogged, userState, setIsLoading, isLoading } =
    useGlobalContext();
  const [document, setDocument] = useState(null);
  const [scannedImage, setScannedImage] = useState();
  const [userRole, setUserRole] = useState("");

  const signOut = () => {
    setIsLoading(true);
    SecureStore.deleteItemAsync("user_data").then((res) => {
      console.log("setting isLogged to false");
      setIsLogged(false);
    });
    setIsLogged(false);
    setIsLoading(false);
  };

  // scan documents
  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 20,
    });
  };

  const getUserRole = (role) => {
    if (role == 1) return "Admin";
    else if (role == 2) return "Staff";
    else if (role == 3) return "Faculty";
  };

  // useEffect(() => {
  //   // call scanDocument on load
  //   scanDocument()
  // }, []);

  return (
    <View>
      <Text style={styles.heading}>Welcome to NIPERG </Text>
      <Text style={styles.lead}>{userState.name.toUpperCase()}</Text>
      <Text style={styles.lead}>Your Email: {userState.email}</Text>
      <Text style={styles.lead}>
        Your Account Type: {getUserRole(userState.role)}
      </Text>
      <Text style={styles.lead}>Your PhoneNo: {userState.phone}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Navigate</Text>
        <View style={styles.inlineBtnView}>
          <TouchableOpacity
            style={styles.taskBtn}
            onPress={() => navigation.navigate("FacultyRegister")}
          >
            <Text>Faculty Register Form</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.taskBtn}
            onPress={() => navigation.navigate("FacultyRegister")}
          >
            <Text>Faculty Register Form</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ButtonRP icon="camera" mode="contained" onPress={() => signOut()}>
        {isLoading ? "Loading..." : "Logout"}
      </ButtonRP>
      <ButtonRP
        style={{ marginTop: 10 }}
        icon="scan-helper"
        mode="contained"
        title="Scan Document"
        onPress={scanDocument}
      >
        Scan Document
      </ButtonRP>
      {scannedImage && (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            border: 1,
          }}
        >
          <Image
            resizeMode="contain"
            style={{ width: "100%", height: "100%", justifyContent: "center" }}
            source={{ uri: scannedImage }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  lead: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    margin: 10,
    backgroundColor: "#fff",
  },
  cardTitle: {
    padding: 5,
    fontSize: 17,
    borderBottomWidth: 1,
    borderColor: "#e6eaf0",
  },
  inlineBtnView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  taskBtn: {
    backgroundColor: "#e6eaf0",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4, // Add horizontal margin for spacing between buttons
  },
});

export default WelcomeScreen;
