import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  ProgressBar,
  Text,
  TextInput,
} from "react-native-paper";
import { theme } from "../../lib/theme";
import { IPost } from "../../lib/types";
import {
  savePostDataToFirestore,
  uploadImageToFirebase,
} from "../../services/firebaseService";

interface IFormData {
  title: string;
  description: string;
}

const CreatePostScreen = (props) => {
  const navigation = props.navigation;
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    description: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  // Function to handle image selection
  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
      console.log("Image set at: ", result.assets[0].uri);
    }
    setModalVisible(false); // Close modal after selection
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
      console.log("Image set at: ", result.assets[0].uri);
    }
    setModalVisible(false); // Close modal after selection
  };

  // Function to handle form field changes
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle the post item
  const handlePostItem = async () => {
    const { valid, message } = validateFormData(formData);
    if (valid) {
      setIsLoading(true);
      try {
        const downloadUrl = await uploadImageToFirebase(
          imageUrl,
          setUploadProgress,
        );
        if (downloadUrl) {
          await savePostDataToFirestore(formData, downloadUrl);
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error posting item:", error);
        alert("Failed to post item. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert(message);
    }
  };

  const validateFormData = (formData: IPost) => {
    for (const key in formData) {
      if (formData[key] === null || formData[key] === "") {
        return {
          valid: false,
          message: `Please fill in the ${key} field before submitting.`,
        };
      }
    }
    return { valid: true };
  };

  useFocusEffect(
    useCallback(() => {
      setFormData({
        title: "",
        description: "",
      });
      setImageUrl("");
    }, []),
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        placeholder="Enter title"
        value={formData?.title}
        onChangeText={(text) => handleInputChange("title", text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Description"
        placeholder="Enter item description"
        value={formData?.description}
        onChangeText={(text) => handleInputChange("description", text)}
        style={[styles.input, { height: 200 }]}
        mode="outlined"
        multiline
        numberOfLines={4}
      />
      {/* Image Upload */}
      <Button
        icon="camera"
        mode="outlined"
        onPress={() => setModalVisible(true)} // Open modal on button press
        style={styles.uploadButton}
      >
        Upload Image
      </Button>
      {!!imageUrl && (
        <>
          <Text style={styles.imageText}>Image selected</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </>
      )}

      <Button
        mode="contained"
        onPress={handlePostItem}
        style={styles.postButton}
        disabled={isLoading}
      >
        Post Item
      </Button>
      {isLoading && (
        <>
          <ProgressBar
            progress={uploadProgress / 100}
            style={styles.progressBar}
          />
          <Text
            style={styles.progressText}
          >{`Uploading: ${Math.round(uploadProgress)}%`}</Text>
        </>
      )}
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.goBackButton}
      >
        Go Back
      </Button>

      {/* Modal for image options */}
      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Title>Select Image Source</Dialog.Title>
          <Dialog.Content>
            <Button onPress={takePhoto}>Take Photo</Button>
            <Button onPress={pickImageFromLibrary}>Choose from Library</Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  input: {
    marginBottom: 15,
    backgroundColor: theme.colors.primaryContainer
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio (1:1 in this case)
    resizeMode: "contain",
    marginVertical: 20,
  },
  uploadButton: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    marginTop: 10,
  },
  progressText: {
    marginTop: 5,
    textAlign: "center",
  },
  imageText: {
    marginTop: 10,
    fontStyle: "italic",
  },
  postButton: {
    marginTop: 20,
  },
  goBackButton: {
    marginTop: 15,
    borderWidth: 1,
  },
});

export default CreatePostScreen;
