import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";

const Comment = (props) => {
  console.log("props.route.params.uid", props.route.params.uid);
  console.log("props.route.params.postId", props.route.params.postId);
  const db = getFirestore();
  const [comments, setComments] = useState<any[]>([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  const auth = getAuth();

  useEffect(() => {
    (async () => {
      if (props?.route?.params?.postId !== postId) {
        const collectionRef = collection(
          db,
          "posts",
          props.route.params.uid,
          "userPosts",
          props.route.params.postId,
          "comments",
        );
        const q = query(collectionRef);
        // TODO: onSnapshot the comments so it gets updated
        const commentsSnapshot = await getDocs(q);

        // let comments = commentsSnapshot.docs.map((doc) => {
        //   const data = doc.data();
        //   console.log("querySnapshot data", data);
        //   const id = doc.id;
        //   return { id, ...data };
        // });

        const tmpComments: any[] = [];
        let userCache = {};

        for (const comment of commentsSnapshot.docs) {
          const commentData = comment.data();
          const creatorId = commentData.creator;
          console.log("looking up creator Id", creatorId);

          if (!userCache[creatorId]) {
            const userRef = doc(db, "users", creatorId);
            const userDocSnap = await getDoc(userRef);
            if (userDocSnap.exists()) {
              console.log("found user");
              userCache = userDocSnap.data();
            } else {
              console.log("unknown user");
              continue;
            }
          }

          tmpComments.push({
            ...commentData,
            user: userCache,
          });
        }

        console.log("tmpComments final", tmpComments);

        setComments(tmpComments);
      }
    })();
  }, []);

  const onCommentSend = async () => {
    console.log("onCommentSend() :: Start");
    const collectionRef = collection(
      db,
      "posts",
      props.route.params.uid,
      "userPosts",
      props.route.params.postId,
      "comments",
    );

    const docRef = await addDoc(collectionRef, {
      creator: auth?.currentUser?.uid,
      text: text,
    });

    console.log("Document written: ", docRef);
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title="Send" />
      </View>
    </View>
  );
};

export default Comment;
