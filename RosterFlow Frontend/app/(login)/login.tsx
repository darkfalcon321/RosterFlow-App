import { useAuth } from '@/context/authContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const Login = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { user } = useAuth();
    const [showMsg, setShowMsg] = useState(false);
    const { message } = useLocalSearchParams() as { message: string };


    useEffect(() => {
        if (user) {
            if (user.roles.includes("ROLE_ADMIN")) {
            router.replace("/tempAdmin");
            } else if (user.roles.includes("ROLE_COMPANY")) {
                router.replace("/tempCompany");
            }
            else if (user.roles.includes("ROLE_SUBCOMPANY")) {
            router.replace("/tempSubCompany");
            } else { 
                router.replace("/tempUser") //too many screens defined
            }
        }
    }, [user]);

    useEffect(() => {
        if (message === "true") {
            setShowMsg(true)
            setTimeout(() => setShowMsg(false), 5000) 
        }
        }, [message]);

       

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        const role = await login(username, password);

        if (!role) {
        setError("Login failed");
        }
        setLoading(false);
    }



    return (
        <>
        <View style={styles.container}>
            <View style={styles.box}>

                <Text style={styles.title}>
                    Rooster Flow Login
                </Text>

                <Image
                    style={styles.logo}
                    source={
                        require('../../assets/images/Logo.png')
                    }></Image>

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
                    ✅Password Changed Successfully
                    </Text>
                </View>
                )}

                    {/* LOGIN */}

                <TextInput
                    style = {styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                />
                    
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

                    {/* FORGOT PASSWORD */}

                <TouchableOpacity onPress={() => router.push("/forgotPassword")} >
                    <Text style={{ marginBottom: 15, color: "blue", textDecorationLine: 'underline', fontSize: 10}}>Forgot Password?</Text>
                </TouchableOpacity>

                    {/* SUBMIT */}

                <TouchableOpacity 
                    onPress={handleLogin} 
                    disabled={loading}      //NEEDS TO BE TESTED
                    style={{
                        backgroundColor: 'blue', 
                        padding: 10,
                        borderRadius: 5,
                        }}>

                    <Text style={{color: 'white',
                        textAlign: 'center',
                        fontSize: 10}}>Login</Text>
                </TouchableOpacity>
           </View>
        </View>      
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,              
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 20,        
    backgroundColor: '#fff',  
    marginBottom: 200   
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

export default Login;