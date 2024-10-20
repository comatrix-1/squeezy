import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import Loader from "../../components/Loader";
import { theme } from "../../lib/theme";
import { IPost, IUser } from "../../lib/types";
import {
  fetchUser,
  fetchUserPosts,
  followUser,
  getAuthCurrentUser,
  listenToFollowStatus,
  unfollowUser,
} from "../../services/firebaseService";

export default function Profile(props) {
  const [profileUser, setProfileUser] = useState<IUser>();
  const [profilePosts, setProfilePosts] = useState<IPost[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const profileUid = props?.route?.params?.uid ?? getAuthCurrentUser()?.uid;

  const handleFollow = async () => {
    await followUser(getAuthCurrentUser()?.uid ?? "", profileUid);
  };

  const handleUnfollow = async () => {
    await unfollowUser(getAuthCurrentUser()?.uid ?? "", profileUid);
  };

  const renderItem = ({ item, index }: { item: IPost; index: number }) => (
    <TouchableOpacity
      style={[styles.touchableCard, index % 2 === 0 ? { marginRight: 8 } : {}]}
      onPress={() =>
        props.navigation.navigate("PostDetail", {
          id: item.id,
          imageUrl: item.downloadUrl,
          name: item.userUid,
          avatar: require("../../assets/default-avatar.png"),
        })
      }
    >
      <Card style={styles.feedCard}>
        <Card.Cover
          source={{
            uri: item.downloadUrl,
          }}
        />
        <Card.Title
          title={item.title}
          titleStyle={styles.titleStyle}
          subtitle={item.description}
          subtitleStyle={styles.subTitleStyle}
          left={() => (
            <Avatar.Image
              size={24}
              source={require("../../assets/default-avatar.png")}
            />
          )}
          leftStyle={styles.leftStyle}
        />
      </Card>
    </TouchableOpacity>
  );

  // useEffect(() => {
  //   fetchUserPosts(profileUid).then(setProfilePosts);

  //   if (profileUid) {
  //     fetchUser(profileUid).then(setProfileUser);
  //     const unsubscribe = listenToFollowStatus(
  //       getAuthCurrentUser()?.uid ?? "",
  //       profileUid,
  //       setFollowing,
  //     );
  //     return () => unsubscribe();
  //   }
  // }, [profileUid]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserPosts(profileUid).then(setProfilePosts);

      if (profileUid) {
        fetchUser(profileUid).then(setProfileUser);
        setLoading(false);
        const unsubscribe = listenToFollowStatus(
          getAuthCurrentUser()?.uid ?? "",
          profileUid,
          setFollowing,
        );
        return () => unsubscribe();
      }
    }, []),
  );

  if (loading || !profileUser) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Avatar.Image
          size={80}
          source={require("../../assets/default-avatar.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>
            {profileUser.name ?? "profileUser name"}
          </Text>
          <Text style={styles.position}>
            @{profileUser.username ?? "currentUser username"}
          </Text>
        </View>
      </View>

      {!!profileUid && profileUid !== getAuthCurrentUser()?.uid ? (
        <View>
          {following ? (
            <Button mode="contained" onPress={handleUnfollow}>
              Following
            </Button>
          ) : (
            <Button mode="contained" onPress={handleFollow}>
              Follow
            </Button>
          )}
        </View>
      ) : null}

      {profilePosts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>No posts available</Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={profilePosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  avatar: {
    alignSelf: "center",
    marginRight: 8,
  },
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  position: {
    fontSize: 14,
    marginBottom: 20,
  },
  touchableCard: {
    flex: 1 / 2,
  },
  feedCard: {
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
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsText: {
    fontSize: 18,
    color: "gray",
  },
});
