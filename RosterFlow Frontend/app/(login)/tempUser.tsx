import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import HomeScreen from '../(tabs)';
import CompanyPage from '../Company';

const tempUser = () => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    const res = logout()
    router.push("/login")
    return res
  }

  return (
    <View style={{width:"100%",height:"100%"}}>
      <HomeScreen/>
    </View>
  );
};

export default tempUser;
