import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Loader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Translucent black background
    zIndex: 1000,
  },
});
