import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { parseFirebaseAuthError } from "../../lib/utils";
import { signUpUser } from "../../services/firebaseService";

interface IFormData {
  email: string;
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register({ navigation }) {
  const [params, setParams] = useState<IFormData>({
    email: "",
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateParams = (params: IFormData) => {
    let returnString = "";
    if (params.password !== params.confirmPassword) {
      returnString = "Passwords do not match.";
    }

    if (
      params.name.trim() === "" ||
      params.email.trim() === "" ||
      params.username.trim() === ""
    ) {
      returnString = "Please fill in the missing fields.";
    }

    if (params.password.trim() === "") {
      returnString = "Password is required.";
    }

    if (params.password.length < 8) {
      returnString = "Password should be at least 8 characters.";
    }

    return returnString;
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const errorString = validateParams(params);
      console.log('errorString', errorString);
      if (errorString) throw new Error(errorString);
      const { success, message } = await signUpUser(params);

      console.log('success', success);

      if (success) {
        navigation.navigate("Home");
      } else throw new Error(message);
    } catch (error) {
      const errorMessage = parseFirebaseAuthError(error.message);
      setError(errorMessage);
    } finally {
      setParams((prev) => {
        return {
          ...prev,
          password: "",
          confirmPassword: "",
        };
      });
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Register for an account</Text>

      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={params.username}
        onChangeText={(text) =>
          setParams((prev) => {
            return { ...prev, username: text };
          })
        }
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Name"
        placeholder="Enter your name"
        value={params.name}
        onChangeText={(text) =>
          setParams((prev) => {
            return { ...prev, name: text };
          })
        }
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={params.email}
        onChangeText={(text) =>
          setParams((prev) => {
            return { ...prev, email: text };
          })
        }
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Password"
        placeholder="Enter your password"
        value={params.password}
        onChangeText={(text) =>
          setParams((prev) => {
            return { ...prev, password: text };
          })
        }
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      <TextInput
        label="Confirm Password"
        placeholder="Enter your password again"
        value={params.confirmPassword}
        onChangeText={(text) =>
          setParams((prev) => {
            return { ...prev, confirmPassword: text };
          })
        }
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Login Button */}
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.loginButton}
        loading={loading}
      >
        Register
      </Button>

      <Text style={styles.haveAnAccount}>Have an account?</Text>
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <Button mode="text" onPress={() => navigation.navigate("SignIn")}>
          Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
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
  haveAnAccount: { marginTop: 15, textAlign: "center" },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});
