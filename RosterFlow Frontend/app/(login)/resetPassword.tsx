import { resetPasswordToken } from '@/context/passwordReset';
import BadRequestPage from '@/error/400';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function resetPassword() {
  
    const [password, setPassword] = useState('');   
    const [confirmpassword, setconfirmPassword] = useState('');   
    const [showPassword, setShowPassword] = useState(false);  
    const [showMsg, setShowMsg] = useState(false);

    const { token } = useLocalSearchParams() as { token: string };
    
    if(!token){
          return <BadRequestPage />;
        }
        

    const handleReset = async () => {
      try{
        const status = await resetPasswordToken(token, password)
        
        if (status === 200){
            router.push({
              pathname: "/login",
              params: {
                message: "true"
              }
            
            })
        }
        else {
            return <BadRequestPage />;    //Not working, status undefined for 400 from server
        }
      }
      catch (error) {
          
      }
    }

    return (
    <View style={styles.container}>
      <View style={styles.box}>

        <Text style={styles.title}>
            Rooster Flow Reset-Password
        </Text>


        <Image
          style={styles.logo}
          source={
              require('../../assets/images/Logo.png')
          }></Image>

        {showMsg && (
          <View style ={{
            backgroundColor: '#de3131ff',
            padding: 10,
            marginBottom: 10,
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ccc'
          }}>
            <Text style={{ color: 'white', fontSize: 10 }}>
              ⛔Bad Token. Request again to change password
            </Text>
          </View>
        )}


        {/* PASSWORD */}

        <View style={{position: 'relative', width: '100%'}}>
            <TextInput
                style = {{...styles.input, paddingRight: 40}}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                />



            <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 13}}
                onPressIn={() => setShowPassword(true)}
                onPressOut={() => setShowPassword(false)}>
                    
                <EvilIcons name="eye" size={24} color="black" />
            </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD */}

        <View style={{position: 'relative', width: '100%'}}>
            <TextInput
                style = {{...styles.input, paddingRight: 40}}
                placeholder="Confirm Password"
                secureTextEntry={!showPassword}
                value={confirmpassword}
                onChangeText={setconfirmPassword}
                />



            <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 13}}
                onPressIn={() => setShowPassword(true)}
                onPressOut={() => setShowPassword(false)}>
                    
                <EvilIcons name="eye" size={24} color="black" />
            </TouchableOpacity>
        </View>

        <TouchableOpacity 
            onPress={handleReset} 
            style={{
                backgroundColor: 'blue', 
                padding: 10,
                borderRadius: 5,
                }}>

            <Text style={{color: 'white',
                textAlign: 'center', fontSize: 10}}>Login</Text>
        </TouchableOpacity>

      </View>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    fontSize: 10,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  box: {
    borderWidth:1,
    width:300,
    padding: 20,
    borderColor: 'grey',
    borderRadius: 10
  },
  logo: {
    width:100,
    height:100,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 99,
    margin: 20,
  }
});