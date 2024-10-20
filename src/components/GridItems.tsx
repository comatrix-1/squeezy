import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { IPost } from "../lib/types";

interface Props {
  posts: IPost[];
  loading: boolean;
  onPressItem: (item: IPost) => void;
}

export const renderFeedItem = ({
  item,
  index,
  onPressItem,
}: {
  item: IPost;
  index: number;
  onPressItem: (item: IPost) => void;
}) => (
  <TouchableOpacity
    key={item.id}
    style={[styles.touchableCard, index % 2 === 0 ? { marginRight: 8 } : {}]}
    onPress={() => onPressItem(item)}
  >
    <Card style={styles.feedCard}>
      <Card.Cover source={{ uri: item.downloadUrl }} />
      <Card.Title
        title={item.title}
        titleStyle={styles.titleStyle}
        subtitle={item.description}
        subtitleStyle={styles.subTitleStyle}
        left={() => (
          <Avatar.Image
            size={24}
            source={require("../assets/default-avatar.png")}
          />
        )}
        leftStyle={styles.leftStyle}
      />
    </Card>
  </TouchableOpacity>
);

export default function GridItems({ posts, loading, onPressItem }: Props) {
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  console.log("GridItems() :: posts: ", posts);

  const handleLoadMore = async () => {};

  return (
    <FlatList
      data={posts}
      renderItem={({ item, index }) =>
        renderFeedItem({ item, index, onPressItem })
      }
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        loading ? (
          <Text style={styles.bottomText}>Loading more posts...</Text>
        ) : (
          <Text style={styles.bottomText}>No posts available.</Text>
        )
      }
      onEndReached={handleLoadMore} // Load more posts when scrolled to the end
      onEndReachedThreshold={0.5}
      numColumns={2}
    />
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  touchableCard: {
    width: "48%",
    marginBottom: 20,
  },
  feedCard: {
    flex: 1,
    marginBottom: 20,
  },
  titleStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  subTitleStyle: {
    fontSize: 12,
  },
  leftStyle: { 
    marginRight: 0

   },
  scrollViewContent: {
    paddingBottom: 60, // Adjust this value based on your bottom navigation height
  },
  bottomText: {
    textAlign: "center",
  },
});
