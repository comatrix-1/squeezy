import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB as Fab, Text, useTheme } from "react-native-paper";
import CustomTabNavigator from "../../components/CustomTabNavigator";
import EventBanner from "../../components/EventBanner";
import { renderFeedItem } from "../../components/GridItems";
import { IPost } from "../../lib/types";
import { fetchPosts } from "../../services/firebaseService";

const ChallengeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Popular");

  const theme = useTheme(); // Access the theme

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

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setPosts([]);
    loadPosts();
  };

  useFocusEffect(
    useCallback(() => {
      console.log("ChallengeScreen() :: Focused!");
      setPosts([]);
      loadPosts();
    }, []),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      e.preventDefault();
      console.log("tabPress");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>#NaturalHarmony</Text>
            <Text style={styles.subHeader}>Ongoing challenge: Oct 1-31</Text>
            <EventBanner />
            <Text style={styles.subHeader}>
              Get creative! For this month's challenge, share a photo where you
              have found harmony in nature.
            </Text>
            <CustomTabNavigator
              tabs={["Popular", "Recent"]}
              selectedTab={selectedTab}
              onSelectTab={handleTabChange}
            />
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

      <Fab
        style={[styles.fab, { backgroundColor: theme.colors.primary }]} // Apply theme color to FAB
        icon="plus"
        onPress={() => navigation.navigate("Post")}
        label="Post"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
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
  fab: {
    position: "absolute",
    margin: 16,
    alignSelf: "center",
    bottom: 0,
  },
  scrollViewContent: {
    paddingBottom: 60, // Adjust this value based on your bottom navigation height
  },
  bottomText: {
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  tab: {
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "blue",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChallengeScreen;
