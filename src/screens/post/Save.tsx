import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  doc,
  serverTimestamp,
  getFirestore,
  setDoc,
  collection,
} from "firebase/firestore";

const SaveScreen = (props) => {
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const storage = getStorage();
  const db = getFirestore();
  const auth = getAuth();

  const childPath = `post/${
    auth?.currentUser?.uid ?? ""
  }/${Math.random().toString(36)}`;
  console.log("childPath", childPath);
  console.log("Save():: props", props);
  console.log("Save():: props.route.params.image", props.route.params.image);

  const uploadImage = async () => {
    console.log("Save() :: uploadImage() Start");
    setIsLoading(true);
    const uri = props.route.params.image;

    if (!caption.trim()) {
      alert("Caption cannot be empty!");
      return;
    }

    const response = await fetch(uri);
    const blob = await response.blob();
    console.log("Save() :: uploadImage() : blob", blob);

    const storageRef = ref(storage, childPath);
    const task = uploadBytesResumable(storageRef, blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      getDownloadURL(task.snapshot.ref).then((downloadURL) => {
        savePostData(downloadURL);
        console.log("File available at", downloadURL);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
      alert("Upload failed. Please try again.");
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);

    setIsLoading(false);
  };

  const savePostData = async (downloadURL) => {
    try {
      console.log("Save() :: savePostData() : downloadURL", downloadURL);
      console.log(
        "Save() :: savePostData() : serverTimestamp()",
        serverTimestamp()
      );
      const userUid = auth?.currentUser?.uid ?? "";
      const userPostsRef = collection(db, "posts", userUid, "userPosts");
      const newPostRef = doc(userPostsRef);

      await setDoc(newPostRef, {
        downloadURL,
        caption,
        createdAt: serverTimestamp(),
      });

      props.navigation.popToTop();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} height={500} />
      <TextInput
        placeholder="Write a caption . . ."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={uploadImage} disabled={isLoading} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default SaveScreen;
