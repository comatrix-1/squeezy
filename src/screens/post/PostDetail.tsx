import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import { IPost } from "../../lib/types";

const PostDetail = ({ route, navigation }) => {
  const post: IPost = route.params;
  const { title, description, downloadUrl, username } = post;

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Avatar.Image
          size={40}
          source={require("../../assets/default-avatar.png")}
        />
        <Text style={styles.username}>{username}</Text>
      </View>

      {/* Image Section */}
      <Image source={{ uri: downloadUrl }} style={styles.postImage} />

      {/* Actions Section */}
      <View style={styles.actions}>
        <TouchableOpacity>
          <Text style={styles.likeButton}>❤️ 2 Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.commentButton}>💬 0 Comments</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.postDescription}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      {/* Description Section */}
      <View style={styles.postDescription}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>

      {/* Add Comment Section */}
      <View style={styles.addComment}>
        <Avatar.Image
          size={30}
          source={require("../../assets/default-avatar.png")}
        />
        <Text style={styles.addCommentText}>Add a comment...</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  username: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  postImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  likeButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postDescription: {
    padding: 10,
  },
  titleText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark color for better readability
  },
  descriptionText: {
    marginTop: 5,
    fontSize: 14,
    color: "#666", // Slightly lighter color for the description
  },
  addComment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addCommentText: {
    marginLeft: 10,
    color: "#888",
  },
});

export default PostDetail;
