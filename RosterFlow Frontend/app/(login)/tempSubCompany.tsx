import { router } from 'expo-router';
import React from 'react';
import { View,Text, TouchableOpacity } from 'react-native';
import CompanyPage from '../Company';
import SubCompanyPage from '../SubCompany';

const tempSubCompany = () => {
  return (<View style={{ flex: 1}}>
      <SubCompanyPage/>
    </View>
  );
};

export default tempSubCompany;
