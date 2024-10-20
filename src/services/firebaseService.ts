import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../lib/firebase";
import { IPost, IUser } from "../lib/types";

export const fetchUserFeedPosts = async (
  postsPerPage: number,
  lastVisiblePost: any = null,
): Promise<{
  posts: IPost[];
  lastVisibleDoc: any;
}> => {
  console.log("fetchUserFeedPosts() postsPerPage", postsPerPage);
  console.log("fetchUserFeedPosts() lastVisiblePost", lastVisiblePost);

  try {
    const postsRef = collection(db, "posts");

    // Build the query with ordering and pagination
    let postsQuery = query(
      postsRef,
      orderBy("createdAt", "desc"),
      limit(postsPerPage),
    );

    if (lastVisiblePost) {
      postsQuery = query(
        postsRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisiblePost),
        limit(postsPerPage),
      );
    }

    const querySnapshot = await getDocs(postsQuery);

    // Ensure there's at least one document fetched
    if (querySnapshot.empty) {
      console.log("No more posts available.");
      return {
        posts: [],
        lastVisibleDoc: null,
      };
    }

    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    console.log("fetchUserFeedPosts() with lastVisiblePost: ", lastVisiblePost);
    console.log(
      "fetchUserFeedPosts() is returning lastVisibleDoc: ",
      lastVisibleDoc,
    );

    // Create an array of post promises to fetch user data
    const postsPromises = querySnapshot.docs.map(
      async (doc): Promise<IPost> => {
        const data = doc.data() as IPost;
        const id = doc.id;

        // Fetch user data based on uid from post
        const userData = await fetchUser(data.userUid); // Make sure the uid field exists in the post data

        return {
          id,
          title: data.title || "Untitled",
          description: data.description || "No description available",
          username: userData ? userData.name : "Anonymous", // Use user's name or fallback to "Anonymous"
          downloadUrl: data.downloadUrl || "",
          createdAt: data.createdAt || null,
        };
      },
    );

    // Resolve all promises to get posts with user names
    const posts = await Promise.all(postsPromises);

    return {
      posts,
      lastVisibleDoc,
    };
  } catch (error) {
    console.error("Error fetching user feed posts:", error);
    return {
      posts: [],
      lastVisibleDoc: null,
    };
  }
};

export const fetchPosts = async (): Promise<{
  posts: IPost[];
}> => {
  console.log("fetchPosts()");

  try {
    const postsRef = collection(db, "posts");

    // Build the query to get all posts ordered by createdAt
    const postsQuery = query(postsRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(postsQuery);

    // Ensure there's at least one document fetched
    if (querySnapshot.empty) {
      console.log("No posts available.");
      return {
        posts: [],
      };
    }

    // Create an array of post promises to fetch user data
    const postsPromises = querySnapshot.docs.map(
      async (doc): Promise<IPost> => {
        const data = doc.data() as IPost;
        const id = doc.id;

        // Fetch user data based on uid from post
        const userData = await fetchUser(data.userUid); // Make sure the uid field exists in the post data

        return {
          id,
          title: data.title || "Untitled",
          description: data.description || "No description available",
          username: userData ? userData.name : "Anonymous", // Use user's name or fallback to "Anonymous"
          downloadUrl: data.downloadUrl || "",
          createdAt: data.createdAt || null,
        };
      },
    );

    // Resolve all promises to get posts with user names
    const posts = await Promise.all(postsPromises);

    return {
      posts,
    };
  } catch (error) {
    console.error("Error fetching user feed posts:", error);
    return {
      posts: [],
    };
  }
};

export const fetchUser = async (uid: string) => {
  console.log("fetchUser() uid", uid);
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("fetchUser() :: No such document!");
    return null;
  }
};

export const fetchUsers = async (queryString: string): Promise<IUser[]> => {
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("name", ">=", queryString));
  const querySnapshot = await getDocs(q);

  const queriedUsers = querySnapshot.docs.map((doc) => {
    console.log("queried user", doc.data());
    const id = doc.id;
    const data = doc.data() as IUser;
    return { id, ...data };
  });

  return queriedUsers;
};

export const fetchUserPosts = async (uid: string): Promise<IPost[]> => {
  try {
    // Reference the main posts collection
    const postsRef = collection(db, "posts");

    // Create a query to fetch posts that match the userUid
    const userPostsQuery = query(postsRef, where("userUid", "==", uid));

    const querySnapshot = await getDocs(userPostsQuery);

    // Fetch user data to get the user's name
    const user = await fetchUser(uid);

    // Map the posts to the IPost structure
    return querySnapshot.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data({ serverTimestamps: "estimate" });

      // Extract all fields required for IPost type, ensuring they exist
      const title = data.title || "Untitled"; // Default to "Untitled" if missing
      const description = data.description || "No description available";
      const name = user?.name || "Anonymous"; // Use user name or fallback to "Anonymous"
      const downloadUrl = data.downloadUrl || ""; // Default to empty string if missing

      const createdAt = data.createdAt
        ? data.createdAt.toDate().toISOString()
        : null;

      // Return an object that matches the IPost interface
      return {
        id,
        title,
        description,
        name,
        downloadUrl,
        createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return []; // Return an empty array on error
  }
};

export const followUser = async (currentUserId: string, profileUid: string) => {
  const userFollowingRef = collection(
    db,
    "following",
    currentUserId,
    "userFollowing",
  );
  const docRef = doc(userFollowingRef, profileUid);
  await setDoc(docRef, {});
};

export const unfollowUser = async (
  currentUserId: string,
  profileUid: string,
) => {
  const userFollowingRef = collection(
    db,
    "following",
    currentUserId,
    "userFollowing",
  );
  const docRef = doc(userFollowingRef, profileUid);
  await deleteDoc(docRef);
};

export const listenToFollowStatus = (
  currentUserId: string,
  profileUid: string,
  callback: (following: boolean) => void,
) => {
  const docRef = doc(
    db,
    "following",
    currentUserId,
    "userFollowing",
    profileUid,
  );
  return onSnapshot(docRef, (doc) => callback(!!doc.data()));
};

export const signOutUser = async () => {
  await auth.signOut();
};

export const getAuthCurrentUser = () => {
  return auth.currentUser;
};
/**
 * Uploads the image to Firebase Storage
 * @param uri The local URI of the image to upload
 * @param onProgress Callback function to report upload progress
 * @returns A promise that resolves with the download URL of the uploaded image
 */
export const uploadImageToFirebase = async (
  uri: string,
  onProgress: (progress: number) => void,
): Promise<string | null> => {
  if (!uri) {
    console.error("uploadImageToFirebase: No image URI provided");
    return null;
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  const childPath = `post/${auth?.currentUser?.uid}/${Math.random().toString(36)}`;
  const storageRef = ref(storage, childPath);
  const task = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error("uploadImageToFirebase: Error during upload", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          console.error(
            "uploadImageToFirebase: Failed to get download URL",
            error,
          );
          reject(error);
        }
      },
    );
  });
};

/**
 * Saves the post data to Firestore
 * @param formData The form data to save
 * @param downloadUrl The download URL of the uploaded image
 * @returns A promise that resolves when the post data is successfully saved
 */
export const savePostDataToFirestore = async (
  formData: any,
  downloadUrl: string,
): Promise<void> => {
  const userUid = auth?.currentUser?.uid ?? "";
  const postsRef = collection(db, "posts");
  const newPostRef = doc(postsRef);

  await setDoc(newPostRef, {
    ...formData,
    downloadUrl,
    userUid,
    createdAt: serverTimestamp(),
  });
};

export const signUpUser = async ({ name, email, password, username }) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    console.log("signUpUser() result", result.user?.uid);

    if (!result.user?.uid) {
      console.log("!auth?.currentUser?.uid");
      throw new Error("An error occurred with fetching auth uid");
    }

    await setDoc(doc(db, "users", result.user.uid), {
      name,
      username,
      email,
    });

    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Error signing up:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

export const signInUser = async ({ email, password }) => {
  try {
    const signInUserResult = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = signInUserResult.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

      const mergedUserData: IUser = {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };

      return {
        success: true,
        message: "Login successful",
        user: mergedUserData,
      };
    } else {
      // Handle the case where the user document does not exist in Firestore
      return {
        success: false,
        message: "User data not found in Firestore",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message || "Login failed",
    };
  }
};

export const listenForMessages = (
  chatId: string,
  callback: (messages: any[]) => void,
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const fetchedMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(fetchedMessages);
  });
};

// Sends a message in a specific chat
export const sendMessage = async (
  chatId: string,
  text: string,
  senderId: string,
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    text,
    senderId,
    createdAt: serverTimestamp(),
  });
};

// Listens for a list of chats for the current user
export const listenForChatList = (
  userId: string,
  callback: (chats: any[]) => void,
) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, orderBy("lastMessageTime", "desc")); // Add filter for user chats if necessary
  return onSnapshot(q, (snapshot) => {
    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chatList);
  });
};
