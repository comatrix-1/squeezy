import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../lib/theme";

export default function ChatListScreen({ navigation }) {
  const dummyChats = [
    {
      id: "chat1",
      chatName: "Alice Johnson", // Updated to match your structure
      lastMessage: "Hey! How's it going?",
      lastMessageTime: new Date("2024-10-15T10:00:00Z"), // Optional, can be removed if not needed
      unreadCount: 2, // Optional, can be removed if not needed
      profileImage: "https://randomuser.me/api/portraits/women/1.jpg", // Sample image URL
    },
    {
      id: "chat2",
      chatName: "Bob Smith", // Updated to match your structure
      lastMessage: "I'm good, thanks! How about you?",
      lastMessageTime: new Date("2024-10-15T10:05:00Z"),
      unreadCount: 0,
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: "chat3",
      chatName: "Charlie Brown", // Updated to match your structure
      lastMessage: "Are we still on for lunch tomorrow?",
      lastMessageTime: new Date("2024-10-15T11:00:00Z"),
      unreadCount: 1,
      profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: "chat4",
      chatName: "Diana Prince", // Updated to match your structure
      lastMessage: "Yes, looking forward to it!",
      lastMessageTime: new Date("2024-10-15T11:10:00Z"),
      unreadCount: 0,
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: "chat5",
      chatName: "Eve Adams", // Updated to match your structure
      lastMessage: "Did you finish the report?",
      lastMessageTime: new Date("2024-10-15T12:00:00Z"),
      unreadCount: 3,
      profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: "chat6",
      chatName: "Frank Castle", // Updated to match your structure
      lastMessage: "Almost done! I will send it by EOD.",
      lastMessageTime: new Date("2024-10-15T12:15:00Z"),
      unreadCount: 0,
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: "chat7",
      chatName: "Gina Rodriguez", // Updated to match your structure
      lastMessage: "Hey! Want to catch up this weekend?",
      lastMessageTime: new Date("2024-10-16T09:30:00Z"),
      unreadCount: 1,
      profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: "chat8",
      chatName: "Hank Pym", // Updated to match your structure
      lastMessage: "Sure! What time works for you?",
      lastMessageTime: new Date("2024-10-16T09:45:00Z"),
      unreadCount: 0,
      profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: "chat9",
      chatName: "Ivy Carter", // Updated to match your structure
      lastMessage: "Did you see the new project updates?",
      lastMessageTime: new Date("2024-10-16T10:00:00Z"),
      unreadCount: 1,
      profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      id: "chat10",
      chatName: "Jack Johnson", // Updated to match your structure
      lastMessage: "Yes, they look great! Excited to start!",
      lastMessageTime: new Date("2024-10-16T10:05:00Z"),
      unreadCount: 0,
      profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  const [chats, setChats] = useState(dummyChats);

  // TODO: re-enable
  // useEffect(() => {
  //   const unsubscribe = listenForChatList("userId", setChats); // Replace 'userId' with actual user's ID
  //   return () => unsubscribe(); // Clean up listener on component unmount
  // }, []);

  const handleChatPress = (chatId) => {
    navigation.navigate("Chat", { chatId });
  };

  const renderChat = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
    >
      <Text style={styles.chatName}>{item.chatName}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
  },
});
