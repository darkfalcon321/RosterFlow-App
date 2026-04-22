import { sendResetLink } from "@/context/passwordReset";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [showMsg, setShowMsg] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    
    // sends otp to user's email
    const handleOtp = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      try{
        if (emailRegex.test(email)) {
          setShowMsg(true);  // show green message
          setIsDisabled(true);
          setTimeout(() => setShowMsg(false), 5000)     //5 SECS UNTIL MESSAGE DISSAPEARS
          setTimeout(() => setIsDisabled(false), 5000)  //5 SECS UNTIL FORGOT PASSWORD BUTTON GET ENABLED
          
          await sendResetLink(email)
        } else {
            setShowMsg(false); // hide if invalid
        }
      } catch (error) {
        console.error(error, "Failed to send Email to Backend")
        return null;
      }
    }; 



  return (
    <View style={styles.container}>
        <View style={styles.box}>

            <Text style={styles.title}>
                Rooster Flow Forget-Password
            </Text>

            <Image
                style={styles.logo}
                source={
                    require('../../assets/images/Logo.png')}>
                
            </Image>

                    {/* EMAIL */}

{showMsg && (
  <View style ={{
    backgroundColor: '#90EE90',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  }}>
    <Text style={{ color: 'white', fontSize: 10 }}>
      ✅We have e-mailed your password reset link!
    </Text>
  </View>
)}


            <TextInput
                style = {styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            
                    {/* SEND OTP */}

            <TouchableOpacity 
                onPress={handleOtp} 
                disabled={isDisabled}
                style={{
                    backgroundColor: isDisabled? 'grey' : 'blue', 
                    padding: 10,
                    borderRadius: 5,
                    width: 100,
                    marginBottom: 15,
                    alignSelf:'center',
                    }}>

                <Text style={{color: 'white', textAlign: 'center', fontSize: 10}}>
                    Send Reset Link
                </Text>
            </TouchableOpacity>


   

            
                    {/* RESET PASSWORD */}


        </View>
    </View>
  )
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