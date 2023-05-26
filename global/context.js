import React from "react";
import { useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const [userState, setUserState] = useState({});

  const getValueFor = async (key) => {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSplashScreen(false);
      return () => {
        clearTimeout(timeout);
      };
    }, 3000);
  }, []);

  useEffect(() => {
    getValueFor("user_data").then((res) => {
        console.log("executing from context");
        if(res == null)
            setIsLogged(false);
        else {
            const userData = JSON.parse(res);
            setUserState(userData);
            setIsLogged(true);
        }
    }).catch((err) => {
        console.log(err);
    })
  }, []);

  useEffect(() => {
    console.log("someone changed isLogged, value = " + isLogged);
  }, [isLogged])
  

  return (
    <AppContext.Provider
      value={{ isLoading, setIsLoading, isLogged, setIsLogged, isSplashScreen, setIsSplashScreen, getValueFor, userState, setUserState}}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
