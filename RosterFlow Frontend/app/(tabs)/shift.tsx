import { Text, View, StyleSheet } from 'react-native';

export default function ShiftScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Shift</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
