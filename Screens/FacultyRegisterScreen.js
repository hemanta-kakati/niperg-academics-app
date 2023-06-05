import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Button as ButtonRP } from "react-native-paper";
import DocumentScanner from "react-native-document-scanner-plugin";
import axios from "axios";
import RNFetchBlob from 'rn-fetch-blob';
const baseUrl =
  "http://172.16.121.178/academics/api/faculty_register.php?action=";
const FacultyRegisterScreen = () => {
  const [date, setDate] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [department, setDepartment] = useState("");
  const [particulars, setParticulars] = useState("");
  const [remark, setRemark] = useState("");
  const [document, setDocument] = useState(null);
  const [scannedImage, setScannedImage] = useState();

  // scan documents
  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 0.8,
    });

    console.log(scannedImages[0]);

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      setScannedImage(scannedImages[0]);
    }
    
  };

  const handleSubmit = async () => {
    // create a form data object
    const formData = new FormData();

    formData.append("date", date);
    formData.append("faculty_id", 3);
    formData.append("dept_id", 4);
    formData.append("particulars", particulars);
    formData.append("remark", remark);

    const scannedImageData = await RNFetchBlob.fs.readFile(scannedImage, 'base64');

    const blob = await RNFetchBlob.polyfill.Blob.build(scannedImageData, {
      type: 'image/jpeg',
    });

    formData.append('scanned_image', blob, 'scanned_image.jpg');

    // Send the form data and scannedImage to the server or perform further actions
    // console.log("Date:", date);
    // console.log("Faculty Name:", facultyName);
    // console.log("Department:", department);
    // console.log("Particulars:", particulars);
    // console.log("Remark:", remark);
    // console.log("Scanned Image URI:", scannedImage);

    // Use the fetch() method to send the FormData object to the server

    try {
      // Use Axios to send the FormData object to the server
      const response = await axios.post(`${baseUrl}save`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Handle the response here
      console.log("success ", response.data);
    } catch (error) {
      // Handle any error that occurred during the request
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Date:</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} />

        <Text style={styles.label}>Faculty Name:</Text>
        <TextInput
          style={styles.input}
          value={facultyName}
          onChangeText={setFacultyName}
        />

        <Text style={styles.label}>Department:</Text>
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
        />

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

        <Button title="Submit" onPress={handleSubmit} />
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
