import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

type CountCardProps = {
  id: string;              // unique identifier (shiftId, projectId, etc.)
  startDate: string;       // e.g. "2025-08-01"
  finishDate: string;      // e.g. "2025-08-26"
};

export default function CountCard({ id, startDate, finishDate }: CountCardProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Example logic: count = number of days between start and finish
    const start = new Date(startDate);
    const end = new Date(finishDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setCount(diffDays >= 0 ? diffDays : 0);
  }, [id, startDate, finishDate]);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Count</Text>
      <Text style={styles.value}>
        ID: {id} {"\n"}
        Start: {startDate} {"\n"}
        Finish: {finishDate} {"\n"}
        Days Count: {count}
      </Text>
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
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#023e8a",
    textAlign: "center",
  },
});
