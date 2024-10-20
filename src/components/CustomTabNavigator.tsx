import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomTabNavigator = ({ tabs, selectedTab, onSelectTab }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.activeTab]}
          onPress={() => onSelectTab(tab)}
        >
          <Text style={styles.tabText}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderBottomColor: "#15b7b9",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomTabNavigator;
