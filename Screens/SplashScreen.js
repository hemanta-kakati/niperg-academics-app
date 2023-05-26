import { StyleSheet,View, Text, Image } from "react-native";
import React from "react";

const SplashScreen = () => {
  return (
    <View style={styles.body}>
      <Image source={require('../assets/niperg-logo-medium.png')} style={styles.image}  resizeMode="cover"/>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  image: {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SplashScreen;
