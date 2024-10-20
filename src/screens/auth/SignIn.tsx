import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAppDispatch } from "../../lib/hooks";
import { parseFirebaseAuthError } from "../../lib/utils";
import { signInUser } from "../../services/firebaseService";
import { setUser } from "../../slices/user";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("test1@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    const result = await signInUser({ email, password });

    if (result.success) {
      dispatch(setUser(result.user)); // Dispatch the setUser action
      navigation.navigate("Home");
    } else {
      const errorMessage = parseFirebaseAuthError(result.message);
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/logo-long.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Login to your account</Text>

      {/* Username (Email) Input */}
      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Login Button */}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        loading={loading}
      >
        Login
      </Button>

      {/* Forgot Password */}
      <Button
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.forgotButton}
      >
        Forgot Password?
      </Button>
      <Text style={{ textAlign: "center" }}>New here?</Text>
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <Button mode="text" onPress={() => navigation.navigate("Register")}>
          Register
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
  },
  forgotButton: {
    marginTop: 15,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});
