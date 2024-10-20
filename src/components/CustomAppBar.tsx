import { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { signOutUser } from "../services/firebaseService";

const CustomAppBar = ({ title, navigation, canGoBack, showGear = false }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleEditProfile = () => {
    closeMenu();
    navigation.navigate("EditProfile");
  };

  const handleLogout = () => {
    closeMenu();
    signOutUser();
  };

  return (
    <Appbar.Header mode="center-aligned">
      {canGoBack && <Appbar.BackAction onPress={() => navigation.goBack()} />}
      <Appbar.Content title={title} />

      {showGear && (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="cog" onPress={openMenu} />}
          anchorPosition="bottom"
        >
          <Menu.Item onPress={handleEditProfile} title="Edit Profile" />
          <Menu.Item onPress={handleLogout} title="Sign Out" />
        </Menu>
      )}
    </Appbar.Header>
  );
};

export default CustomAppBar;
