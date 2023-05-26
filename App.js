import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { AppProvider } from "./global/context";
import Main from "./Main";


export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    // flexDirection: "row",
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // marginTop: 30,
  },
});
