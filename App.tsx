import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper"; // Import Appbar
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider } from "react-redux";
import CustomAppBar from "./src/components/CustomAppBar";
import { useAppDispatch, useAppSelector } from "./src/lib/hooks";
import { store } from "./src/lib/store";
import { theme } from "./src/lib/theme";
import RegisterScreen from "./src/screens/auth/Register";
import SignInScreen from "./src/screens/auth/SignIn";
import ChatListScreen from "./src/screens/chat/ChatList";
import ChatScreen from "./src/screens/chat/ChatScreen";
import ChallengeScreen from "./src/screens/post/Challenge";
import CommentScreen from "./src/screens/post/Comment";
import CreatePostScreen from "./src/screens/post/CreatePost";
import FeedScreen from "./src/screens/post/Feed";
import LeaderboardScreen from "./src/screens/post/Leaderboard";
import PostDetailScreen from "./src/screens/post/PostDetail";
import ProfileScreen from "./src/screens/post/Profile";
import SearchScreen from "./src/screens/post/Search";
import { fetchUser, getAuthCurrentUser } from "./src/services/firebaseService";
import { clearData, setUser } from "./src/slices/user";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeFlow: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearData());
    fetchUser(getAuthCurrentUser()?.uid ?? "").then((data) =>
      dispatch(setUser(data)),
    );
  }, []);

  if (currentUser === undefined) {
    return (
      <View>
        <Text>User is undefined.</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator initialRouteName="FeaturedPosts" labeled={false}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={CreatePostScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Post");
          },
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="message" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile");
          },
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const LoggedOutNavigator = () => (
  <Stack.Navigator
    initialRouteName="SignIn"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
  </Stack.Navigator>
);

const LoggedInNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={HomeFlow}
      options={({ route, navigation }) => ({
        header: () => {
          const focusedRoute = getFocusedRouteNameFromRoute(route) ?? "Home";
          const showGear = focusedRoute === "Profile";

          return (
            <CustomAppBar
              title={focusedRoute}
              navigation={navigation}
              canGoBack={navigation.canGoBack()}
              showGear={showGear}
            />
          );
        },
      })}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Search"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Post"
      component={CreatePostScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Create Post"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Comment"
      component={CommentScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Comments"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Profile"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
            showGear
          />
        ),
      })}
    />
    <Stack.Screen
      name="PostDetail"
      component={PostDetailScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Post Detail"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Messages"
      component={ChatListScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Messages"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Chat"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Leaderboard"
      component={LeaderboardScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Leaderboard"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Challenge"
      component={ChallengeScreen}
      options={({ navigation }) => ({
        header: () => (
          <CustomAppBar
            title="Challenge"
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoggedIn(false);
        setLoaded(true);
      } else {
        setLoggedIn(true);
        setLoaded(true);
      }
    });
  }, []);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          {loggedIn ? <LoggedInNavigator /> : <LoggedOutNavigator />}
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
