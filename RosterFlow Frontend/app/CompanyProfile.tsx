/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Text, TouchableOpacity, View,StyleSheet, SafeAreaView, Modal, TextInput, Button, Pressable, Alert,Image} from 'react-native';
import * as React from 'react';
import { FloatingAction } from 'react-native-floating-action';
 import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeviceInfo from 'react-native-device-info';
import { Dropdown } from 'react-native-element-dropdown';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { it } from 'node:test';
import axios from 'axios';
import { getToken } from '@/services/AuthStorage';


function CompanyProfile({route}) {
    const [userData, setUserData] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [about, setAbout] = useState("")
    const [website, setWebsite] = useState("")
    const [refresh, setRefresh] = useState(true)
    const { isCompany } = route.params

    console.log(isCompany)
    
    React.useEffect(() => {
        console.log(userData)
        if (refresh) {
            //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
            getToken().then((token) => {
            axios.get(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/profile/company/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    //'Content-Type': 'application/json',
                }
            })
                .then(response => {
                    //console.log(response.data);
                    if (response.status == 204) {
                        //setRefresh(true)
                        console.log("no dat")
                        //setUserData(response.data)
                    }
                    else if (response.status == 200) {
                        console.log("getting data")
                        setUserData(response.data)
                    }
                    //should populate shifts
                    //setShifts(response.data)
                })
                .catch(error => {
                    console.error(error);
                });
            });
            setRefresh(false)
        }
    },[refresh])
    
  return (
      <View style={{alignItems:"center",height:"100%",width:"100%"}}>
          <Image
            source={require('../assets/images/fake.jpeg')}
            style={[{ width: 200, height: 200, borderRadius: 1000,margin:10 }]}
          />
          <View>
              <View style={{display:"flex",flexDirection:"row",width:"60%",justifyContent:"left",alignItems:"center"}}>
                  <Text style={{ fontWeight: "bold", padding: 10 }}>Company name: </Text>
                  {userData ? userData.companyName ? <Text>{ userData.companyName}</Text>:<Text>Not present</Text>:<Text>Not present</Text>}
              </View>
              <View style={{display:"flex",flexDirection:"row",width:"60%",justifyContent:"left",alignItems:"center"}}>
                  <Text style={{ fontWeight: "bold", padding: 10 }}>Contact email: </Text>
                  {userData ? userData.contactEmail ? <Text>{userData.contactEmail}</Text>:<Text>Not present</Text>:<Text>Not present</Text>}
              </View>
              <View style={{display:"flex",width:"60%",flexDirection:"row",justifyContent:"left",alignItems:"center"}}>
                  <Text style={{ fontWeight: "bold", padding: 10 }}>Phone: </Text>
                  {userData ? userData.phone ? <Text>{ userData.phone}</Text>:<Text>Not present</Text>:<Text>Not present</Text>}
              </View>
              <View style={{display:"flex",width:"60%",flexDirection:"row",justifyContent:"left",alignItems:"center"}}>
                  <Text style={{ fontWeight: "bold", padding: 10 }}>Address: </Text>
                  {userData ? userData.address ? <Text>{ userData.address}</Text>:<Text>Not present</Text>:<Text>Not present</Text>}
              </View>
              <View style={{display:"flex",width:"60%",flexDirection:"row",justifyContent:"left",alignItems:"center"}}>
                  <Text style={{ fontWeight: "bold", padding: 10 }}>Website: </Text>
                  {userData ? userData.website ? <Text>{ userData.website}</Text>:<Text>Not present</Text>:<Text>Not present</Text>}
              </View>
              <View style={{display:"flex",width:"60%",flexDirection:"row",justifyContent:"left",alignItems:"center"}}>
                  <Text style={{ fontWeight: "bold", padding: 10 }}>About: </Text>
                  {userData ? userData.description ? <Text>{ userData.description}</Text>:<Text>Not present</Text>:<Text>Not present</Text>}
              </View>
          </View>
          {modalVisible && <Modal
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)} // Required for Android back button
              animationType="fade" // Optional: 'none', 'slide', 'fade'
              transparent={true} // Optional: Renders modal over a transparent background
          >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, height: 500, width: 300 }}>
                      <ScrollView>
                      <Text>Company name:</Text>
                      <TextInput placeholder='Company name' value={firstName} maxLength={30} multiline={true} onChangeText={(e) => {
                            setFirstName(e)
                      }} />
                      <Text>Contact email:</Text>
                      <TextInput placeholder={"Contact email"} value={contactEmail} maxLength={30} multiline={true} onChangeText={(e) => {
                            setContactEmail(e)
                      }} />
                      <Text>Phone:</Text>
                      <TextInput placeholder={"Phone"} value={phone} maxLength={10} multiline={true} onChangeText={(e) => {
                            setPhone(e)
                      }} />
                      <Text>Address:</Text>
                      <TextInput placeholder={"Address"} value={address} maxLength={50} multiline={true} onChangeText={(e) => {
                            setAddress(e)
                          }} />
                        <Text>Website:</Text>
                      <TextInput placeholder={"Website"} value={website} maxLength={30} multiline={true} onChangeText={(e) => {
                              setWebsite(e)
                              //console.log(e)
                      }} />
                      <Text>About:</Text>
                      <TextInput placeholder={"About"} value={about} maxLength={100} multiline={true} onChangeText={(e) => {
                              setAbout(e)
                              //console.log(e)
                      }} />
                          <View style={{display:"flex",flexDirection:"row"}}>
                              <View style={{padding:10}}>
                                  <Button title='Cancel' color={"red"} onPress={() => setModalVisible(false)} />
                              </View>
                              <View style={{padding:10}}>
                                  <Button title='Update' onPress={() => {
                                      console.log(about)
                                      setModalVisible(false)
                                      //update the user
                                      //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
                                      if(contactEmail!="" && firstName!=""){
                                        getToken().then((token) => {
                                        axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/profile/company', { companyName: firstName, lastName: lastName, phone: phone, contactEmail: contactEmail, address: address, description: about,website:website }, {
                                        headers: {
                                                'Authorization': `Bearer ${token}`,
                                                'Content-Type': 'application/json',
                                        }
                                        })
                                        .then(response => {
                                            if (response.status == 200) {
                                                //setUserData(response.data)
                                                console.log("success")
                                                //setRefresh(true)
                                                setUserData(response.data)
                                            }
                                            
                                            //should populate shifts
                                            //setShifts(response.data)
                                        })
                                        .catch(error => {
                                        console.error(error);
                                        });
                                        });
                                          }
                                  }} />
                              </View>
                          </View>
                          
                    </ScrollView>
                          
                  </View>
              </View>
          </Modal>}
          {isCompany && <FloatingAction
          actions={  [{
    text: "Edit",
    icon: <FontAwesome name="edit" size={20} color="white" />,
    name: "edit",
          }]}
        onPressItem={name => {
          if (name === "edit") {
              setModalVisible(true)
            }
      console.log(`selected button: ${name}`);
    }}
  />}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  },
  emptyDate: {
    margin:10
  }
});

/*
<DateTimePicker
              value={date}
        mode="date"
        display='spinner'
        onChange={onChange}
            />
*/

export default CompanyProfile;
