import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { List, Searchbar, Text } from "react-native-paper";
import { theme } from "../../lib/theme";
import { IUser } from "../../lib/types";
import { fetchUsers } from "../../services/firebaseService";

export default function Search({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultAvatar = require("../../assets/default-avatar.png");

  const handleSearch = async () => {
    setLoading(true);
    const users = await fetchUsers(searchQuery);
    setSearchResults(users);
    setLoading(false);
  };

  const renderSearchResults = () => {
    if (loading) {
      return <Text style={styles.noResultsText}>Loading...</Text>;
    }

    if (searchResults.length > 0) {
      return (
        <List.Section>
          {searchResults.map((user: IUser) => (
            <List.Item
              key={user.email} // Use email as a unique identifier since id isn't available in IUser
              title={user.name} // Display user's name
              description={`@${user.username}`} // Display user's username as description
              left={() => (
                <Image
                  source={
                    user.photoURL ? { uri: user.photoURL } : defaultAvatar
                  }
                  style={styles.avatar} // Avatar style defined below
                />
              )}
              onPress={() => console.log(`User ${user.username} clicked`)} // Handle item click
            />
          ))}
        </List.Section>
      );
    }

    return <Text style={styles.noResultsText}>No results found.</Text>;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.searchContainer}>
          <Searchbar
            style={styles.searchbar}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>

        {renderSearchResults()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  searchContainer: {
    width: "100%",
    marginVertical: 16,
  },
  searchbar: {
    flex: 1,
    width: "100%",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
});
