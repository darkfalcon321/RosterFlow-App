import { View, Text, StyleSheet } from "react-native";

type UserInfoCardProps = {
  name: string;
  phone: string;
  address: string;
  email: string;
};

export default function UserInfoCard({ name, phone, address, email }: UserInfoCardProps) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>Name: {name}</Text>
      <Text style={styles.infoText}>Phone: {phone}</Text>
      <Text style={styles.infoText}>Address: {address}</Text>
      <Text style={styles.infoText}>Email: {email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#0077b6",
  },
});
