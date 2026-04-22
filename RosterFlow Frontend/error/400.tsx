import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BadRequestPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.code}>400</Text>
      <Text style={styles.message}>Bad Request / Invalid Token</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  code: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  message: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1890FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
