import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Button as ButtonRP, DataTable } from "react-native-paper";
import DocumentScanner from "react-native-document-scanner-plugin";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useGlobalContext } from "../global/context";
import DatePicker from "react-native-date-picker";
import RNFS from "react-native-fs";
const baseUrl =
  "http://172.16.121.178/academics/api/faculty_register.php?action=";

const optionsPerPage = [2, 3, 4];
const FacultyRegisterScreen = ({ navigation }) => {
  // for datepicker
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState(0);
  const [particulars, setParticulars] = useState("");
  const [remark, setRemark] = useState("");
  const [scannedImage, setScannedImage] = useState();
  const { setIsLoading, isLoading } = useGlobalContext();

  // scan documents
  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 11,
    });

    console.log(scannedImages[0]);

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      setScannedImage(scannedImages[0]);
    }
  };

  // on load, get faculties from api
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}get_faculties`)
      .then((response) => {
        // Handle the response data
        console.log("faculties ", response.data);
        setFaculties(response.data);
        // providing a default picker value, so that when user dont select any faculty or faculty happends to be the first faculty from the list, first faculty id is sent 
        setFacultyId(response.data[0].id)
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    // create a form data object
    const formData = new FormData();

    // extract only date from date and time
    formData.append("date", date.toISOString().split("T")[0]);
    formData.append("faculty_id", facultyId);
    formData.append("particulars", particulars);
    formData.append("remark", remark);

    if (scannedImage) {
      formData.append("file", {
        uri: scannedImage,
        type: "image/jpeg",
        name: `fr.jpg`,
      });
    }

    console.log(formData);

    try {
      const response = await axios.post(
        `http://172.16.121.178/academics/api/faculty_register.php?action=save`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // const response = await axios.post(`${baseUrl}save`, formData);

      console.log("success", response);

      const { status, msg } = response.data;

      // remove scanned file now since its uploaded
      try {
        await RNFS.unlink(scannedImage);
        console.log("Scanned image deleted:", scannedImage);
      } catch (error) {
        console.error("Error deleting scanned image:", error);
      }

      if (status == "1") {
        Alert.alert("Success", msg);

        // delete the images that is stored in phone by the scanner

        // replace the screen, so that the form is reseted
        navigation.replace("FacultyRegister");
      } else Alert.alert("Error", msg);
    } catch (error) {
      if (error.response) {
        Alert.alert("Error", error.response.status);
        console.error("Server Error:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request Error:", error.request);
        Alert.alert("Error", error.response.status);
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", error.response.status);
      }
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Date:</Text>
        {/* <Button title={date.toDateString()} color="#fff" onPress={() => setOpen(true)} /> */}
        <ButtonRP
          style={{
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 5,
            flexDirection: "row",
          }}
          icon="update"
          mode="outlined"
          textColor="#000"
          title="Scan Document"
          onPress={() => setOpen(true)}
        >
          {date.toDateString()}
        </ButtonRP>
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <Text style={styles.label}>Select Faculty:</Text>
        <Picker
          style={styles.input}
          selectedValue={facultyId}
          onValueChange={(itemValue) => setFacultyId(itemValue)}
        >
          {faculties && faculties.length > 0 ? (
            faculties.map((faculty, index) => (
              <Picker.Item
                key={index}
                label={`${faculty.name} (${faculty.dept_alias})`}
                value={faculty.id}
              />
            ))
          ) : (
            <Picker.Item label="No faculties found" value="" />
          )}
        </Picker>

        <Text style={styles.label}>Particulars:</Text>
        <TextInput
          style={styles.textArea}
          value={particulars}
          onChangeText={setParticulars}
          multiline
        />

        <Text style={styles.label}>Remark:</Text>
        <TextInput
          style={styles.input}
          value={remark}
          onChangeText={setRemark}
        />

        <ButtonRP
          style={{
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 5,
            backgroundColor: "#577AF0",
          }}
          icon="scan-helper"
          mode="contained"
          title="Scan Document"
          onPress={scanDocument}
          textColor="#fff"
        >
          Scan Document
        </ButtonRP>

        {scannedImage ? (
          <Text style={styles.fileText}>{scannedImage}</Text>
        ) : (
          <Text style={styles.fileText}>No image scanned</Text>
        )}

        {scannedImage ? (
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={{ uri: scannedImage }}
            />
          </View>
        ) : (
          <Text style={styles.fileText}>No image scanned</Text>
        )}

        <Button title="Submit" disabled={isLoading} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  fileText: {
    marginVertical: 8,
  },
  imageContainer: {
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginLeft: "auto",
    marginRight: "auto",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default FacultyRegisterScreen;
