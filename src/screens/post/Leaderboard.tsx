import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Avatar, Card, Text } from "react-native-paper";

const LeaderboardScreen = ({ navigation }) => {
  const sectionItem = {
    id: "1",
    name: "Nature: Music and Harmony",
    description: "Share a photo related to the theme!",
    avatarIcon: "account-circle-outline", // MaterialCommunityIcons icon
  };

  const mostLikedData = [
    {
      id: "1",
      name: "John",
      likes: 2569,
      avatar: require("../../assets/default-avatar.png"),
    },
    {
      id: "2",
      name: "Anna",
      likes: 2250,
      avatar: require("../../assets/default-avatar.png"),
    },
  ];

  const mostViewedData = [
    {
      id: "1",
      name: "Jane",
      views: 3222,
      avatar: require("../../assets/default-avatar.png"),
    },
    {
      id: "2",
      name: "Paul",
      views: 3183,
      avatar: require("../../assets/default-avatar.png"),
    },
  ];

  // Render each leaderboard card
  //   const renderItem = (item, type) => (
  //     <Card style={styles.card}>
  //       <View style={styles.cardContent}>
  //         <Avatar.Image size={50} source={item.avatar} />
  //         <View style={styles.textSection}>
  //           <Text style={styles.name}>{item.name}</Text>
  //           {type === "likes" ? (
  //             <Text>{item.likes} Likes</Text>
  //           ) : (
  //             <Text>{item.views} Views</Text>
  //           )}
  //         </View>
  //         <Icon
  //           name={type === "likes" ? "heart" : "eye"}
  //           size={24}
  //           color={type === "likes" ? "red" : "blue"}
  //         />
  //       </View>
  //     </Card>
  //   );

  const renderItem = ({ item, index }) => {
    if (!item) return;
    else
      return (
        <TouchableOpacity
          style={[
            styles.touchableCard,
            index % 2 === 0 ? { marginRight: 8 } : {},
          ]}
          onPress={() =>
            navigation.navigate("PostDetail", {
              id: item.id,
              image: item.image,
              name: item.name,
              avatar: item.avatar || require("../../assets/default-avatar.png"),
              likes: item.likes,
              comments: item.comments,
            })
          }
        >
          <Card style={styles.feedCard}>
            <Card.Cover source={item.image} />
            {/* TODO: decide if showing actions  */}
            {/* <Card.Actions style={styles.feedActions}>
        <Button icon="heart-outline">{item.likes}</Button>
        <Button icon="comment-outline">{item.comments}</Button>
      </Card.Actions> */}
            <Card.Title
              title={item.name}
              left={() => (
                <Avatar.Image
                  size={24}
                  source={require("../../assets/default-avatar.png")}
                />
              )}
            />
          </Card>
        </TouchableOpacity>
      );
  };

  return (
    <View>
      <View style={styles.container}>
        <Card style={styles.exploreCard}>
          <Card.Content style={styles.exploreContent}>
            <Avatar.Icon size={48} icon={sectionItem.avatarIcon} />
            <View style={styles.exploreText}>
              <Text style={styles.exploreName}>{sectionItem.name}</Text>
              <Text style={styles.exploreDescription}>
                {sectionItem.description}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Most Liked Section */}
        <Text style={styles.sectionHeader}>Most Liked</Text>
        <FlatList
          data={mostLikedData}
          renderItem={(item) => renderItem(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        {/* Most Viewed Section */}
        <Text style={styles.sectionHeader}>Most Viewed</Text>
        <FlatList
          data={mostViewedData}
          renderItem={(item) => renderItem(item)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  exploreCard: {
    marginBottom: 16,
  },
  exploreContent: {
    flexDirection: "row",
  },
  exploreText: {
    marginLeft: 16,
  },
  exploreName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  exploreRole: {
    color: "#6A1B9A",
  },
  exploreDescription: {
    marginTop: 4,
    color: "#555",
  },
  touchableCard: {
    flex: 1 / 2,
  },
  feedCard: {
    marginBottom: 20,
  },
  card: {
    marginHorizontal: 8,
    marginBottom: 16,
    width: 150,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  textSection: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LeaderboardScreen;
