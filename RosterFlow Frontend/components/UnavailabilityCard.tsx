// components/UnavailabilityCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type UnavailabilityCardProps = {
  days: string[];
};

export default function UnavailabilityCard({ days }: UnavailabilityCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/Unavailability")}
    >
      <Text style={styles.label}>Unavailability</Text>
      <Text style={styles.value}>{days.join(", ")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#0077b6",
    marginBottom: 10,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#023e8a",
    textAlign: "center",
  },
});
