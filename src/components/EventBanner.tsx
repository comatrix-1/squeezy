import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";

export default function EventBanner() {
  const sectionItem = {
    id: "1",
    name: "Natural Harmony",
    description: "Share a photo related to the theme!",
  };

  return (
    <Card style={styles.exploreCard}>
      <Card.Cover source={require("../assets/background-pattern.jpg")} />
      <Card.Title title={sectionItem.name} titleStyle={styles.exploreName} />
      <Card.Content style={styles.exploreContent}>
        <Text style={styles.exploreDescription}>{sectionItem.description}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
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
});
