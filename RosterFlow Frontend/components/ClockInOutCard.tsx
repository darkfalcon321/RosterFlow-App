import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ClockInOutCard() {
  const [status, setStatus] = useState<"IN" | "OUT" | null>(null);

  const handleClockToggle = () => {
    setStatus((prev) => (prev === "IN" ? "OUT" : "IN"));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Clock In/Out</Text>
      <Text style={styles.value}>{status ? `You are Clocked ${status}` : "Not clocked in"}</Text>
      <TouchableOpacity style={styles.button} onPress={handleClockToggle}>
        <Text style={styles.buttonText}>
          {status === "IN" ? "Clock Out" : "Clock In"}
        </Text>
      </TouchableOpacity>
    </View>
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
  },
  value: {
    fontSize: 14,
    color: "#023e8a",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#0077b6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
