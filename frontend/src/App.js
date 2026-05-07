import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";
import api from "./api/axios";

const fnc = async () => {
  try {
    const res = api.get("/ping");
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

const App = () => {
  fnc();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
