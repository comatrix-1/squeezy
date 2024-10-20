import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function AddScreen({ navigation }) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryStatus, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </View>
    );
  }

  if (!galleryStatus?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to access the gallery.
        </Text>
        <Button onPress={requestGalleryPermission}>grant permission</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          facing={facing}
        ></CameraView>
      </View>
      <Button style={styles.button} onPress={toggleCameraFacing}>
        Flip Camera
      </Button>
      <Button style={styles.button} onPress={takePicture}>
        <Text style={styles.text}>Take Picture</Text>
      </Button>
      <Button style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Pick image from gallery</Text>
      </Button>
      <Button
        style={styles.button}
        onPress={() => navigation.navigate("Save", { image })}
      >
        <Text style={styles.text}>Save</Text>
      </Button>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});
