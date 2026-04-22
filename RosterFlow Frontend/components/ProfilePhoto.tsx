import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";

type ProfilePhotoProps = {
  image: any;
  onAddPhoto: () => void;
};

export default function ProfilePhoto({ image, onAddPhoto }: ProfilePhotoProps) {
  return (
    <View style={styles.photoContainer}>
      <Image source={image} style={styles.profileImage} />
      <TouchableOpacity style={styles.addButton} onPress={onAddPhoto}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    position: "relative",
    marginBottom: 90,
  },
  profileImage: {
    width: 190,
    height: 190,
    borderRadius: 190,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#ccc",
  },
  addButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0077b6",
  },
  addButtonText: {
    color: "#0077b6",
    fontSize: 20,
    fontWeight: "bold",
  },
});
