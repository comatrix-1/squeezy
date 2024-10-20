import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import EventBanner from "../../components/EventBanner";
import { renderFeedItem } from "../../components/GridItems";
import Loader from "../../components/Loader";
import SectionHeader from "../../components/SectionHeader";
import { theme } from "../../lib/theme";
import { IPost } from "../../lib/types";
import { fetchPosts } from "../../services/firebaseService";

const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { posts: newPosts } = await fetchPosts();
      setPosts(newPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToChallenge = () => {
    navigation.navigate("Challenge");
  };

  useFocusEffect(
    useCallback(() => {
      console.log("ChallengeScreen() :: Focused!");
      setPosts([]);
      loadPosts();
    }, []),
  );

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <SectionHeader title="Ongoing Events" />
            <TouchableOpacity onPress={navigateToChallenge}>
              <EventBanner />
            </TouchableOpacity>
            <SectionHeader title="Your Feed" />
          </>
        }
        renderItem={({ item, index }) =>
          renderFeedItem({
            item,
            index,
            onPressItem: (item) => navigation.navigate("PostDetail", item),
          })
        }
        ListEmptyComponent={
          loading ? (
            <Text style={styles.bottomText}>Loading more posts...</Text>
          ) : (
            <Text style={styles.bottomText}>No posts available.</Text>
          )
        }
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    color: "#777",
    marginVertical: 5,
  },
  exploreCard: {
    marginBottom: 16,
  },
  exploreContent: {
    flexDirection: "row",
  },
  exploreName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  exploreDescription: {
    marginTop: 4,
    color: "#555",
  },
  feedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  leftStyle: { marginRight: 0 },
  scrollViewContent: {
    paddingBottom: 60, // Adjust this value based on your bottom navigation height
  },
  bottomText: {
    textAlign: "center",
  },
});

export default FeedScreen;
