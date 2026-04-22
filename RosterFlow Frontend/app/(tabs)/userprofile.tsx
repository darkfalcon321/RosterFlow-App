import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker"; // 👈 import expo-image-picker
import ProfilePhoto from "../../components/ProfilePhoto";
import UserInfoCard from "../../components/UserInfoCard";

export default function UserProfileScreen() {
  // 👇 Replace this with username from auth (hardcoded for now)
  const username = "Sadikshya";

  // State for storing profile image (URI if user picks from gallery)
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Function to pick an image from gallery
  const handleAddPhoto = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your gallery to add a photo."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // crop option
      aspect: [1, 1], // square image
      quality: 0.8,
    });

    if (!result.canceled) {
      // Store selected image URI
      setProfileImage(result.assets[0].uri);
    }
  };

  // 👇 Replace these details with real data from your user (API / AsyncStorage / Context)
  const userInfo = {
    name: username, // logged-in username
    phone: "+61 123 456 789",
    address: "123 Main Street, Perth, Australia",
    email: `${username.toLowerCase()}@google.com`,
  };

  return (
    <View style={styles.container}>
      {/* Profile Photo with Add button */}
      <ProfilePhoto
        image={
          profileImage
            ? { uri: profileImage } // if user picked photo
            : require("../../assets/images/profile.png") // default placeholder
        }
        onAddPhoto={handleAddPhoto} // function when "Add Photo" button pressed
      />

      {/* User Info Card */}
      <UserInfoCard {...userInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0077b6",
    alignItems: "center",
    paddingTop: 120,
  },
});
