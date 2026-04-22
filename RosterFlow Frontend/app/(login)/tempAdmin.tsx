import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AdminPage from '../Admin';
import { StatusBar } from 'expo-status-bar';

const tempAdmin = () => {
    const { logout } = useAuth();
  return (<View style={{flex:1}}>
    <AdminPage/>
    </View>
  );
};

export default tempAdmin;
