/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, useColorScheme, View,FlatList, Modal,TouchableWithoutFeedback, Button, TextInput } from 'react-native';
import { Text } from 'react-native';
import * as React from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
 import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FloatingAction } from "react-native-floating-action";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { deleteToken, getToken, saveToken } from "@/services/AuthStorage";
import { decodeToken } from '@/services/decodeToken';
import { ref } from 'process';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const showAlert = (item,removeItem,ref,updateOpenRefs) =>
  Alert.alert(
    'Delete',
    'Are you sure you want to delete '+item.name+"?",
    [
      {
        text: 'Yes',
        onPress: () => {
          //delete item
          //deleteItem()
          //element
          ref.current?.close()
          updateOpenRefs([])
          removeItem(item)
        },
        style: 'default',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
    },
  );

const MyListItem = ({item, removeItem,updateOpenRefs,openRefs}) => {
  const swipeableRef = useRef(null);
  const renderRightActions = (progress: SharedValue<number>, dragX: SharedValue<number>) => {
    const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
      useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  });
    const styleAnimation = useAnimatedStyle(() => {

      return {
      //basically occupying 20% of the screen
      transform: [{ translateX: dragX.value+Math.ceil(dimensions.screen.width*0.2) }],
    };
  });

    return (
      <Reanimated.View style={[{backgroundColor:"#C5C6D0",padding:10,width:"20%",margin:10,alignItems:"center",justifyContent:"center",marginRight:10,borderTopEndRadius:8,borderBottomEndRadius:8,        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 20,
        shadowColor: '#52006A',},styleAnimation]}>
      <FontAwesome name="trash" size={30} color="red" onPress={() => {
        //popup on screen
        showAlert(item,removeItem,swipeableRef,updateOpenRefs)
          }} />;
    </Reanimated.View>
  );
  };
  const element=(<Swipeable
    friction={2}
    enableTrackpadTwoFingerGesture
    rightThreshold={40}
    ref={swipeableRef}
    onSwipeableWillOpen={() => {
      openRefs.forEach((ref) => {
        ref.current?.close()
      })
      updateOpenRefs([swipeableRef])
    }}
    renderRightActions={renderRightActions}
  >
    <View style={styles.listItem} >
      <Text style={styles.item}>{item.name}</Text>
    </View></Swipeable>)
  return element
};

//This page gets called when an user log in if it is an Admin
function AdminPage() {
    const isDarkMode = useColorScheme() === 'dark';
    type Item = {username: string,name:string};
    const n = 100
  const company = { "username": "abc@gmail.com", "name": "My company name" }
  const repeatedArray = [];

  //const repeatedArray = Array.from({ length: n }, (_, i) => i + 1);
  let i = 0
  while (i < n) {
    repeatedArray.push({ "username": "abc@gmail.com", "name": "My company name "+i })
    i+=1
  }
  
  const [data, updateData] = useState([])
  const [openRefs, updateOpenRefs] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [name, updateName] = useState("")
  const [email, updateEmail] = useState("")
  const [emailError, updateEmailError] = useState(false)
  const [nameError, updateNameError] = useState(false)
  const [refresh, setRefresh] = useState(true)

  const processToken = async() => {
    const token = await getToken();
    console.log("The token is: "+token)
    return token
  }

  useEffect(() => {
    if (refresh) {
      processToken().then((token) => {
        console.log(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/user/unavailability/see')
        console.log("Bearer " + token)
        axios.get(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/admin/companies', {
          headers: {
            'Authorization': `Bearer ${token}`,
            //'Content-Type': 'application/json',
          }
        })
          .then(response => {
            console.log(response.data);
            if (response.status == 200) {
              setRefresh(false)
              updateData(response.data)
              console.log("her")
            }
            //should populate shifts
            //updateData(response.data)
          })
          .catch(error => {
            console.log(error.response);
          });
      });
    }
    
  }, [refresh])

  useEffect(() => {
    if (!modalVisible) {
      updateEmailError(false)
      updateNameError(false)
    }
  },[modalVisible])
  const keyExtractor=(item:Item) => {item.username}
  
  const removeItem = (item) => {
    updateData(data.filter(p => p.name !== item.name))
  }
  const addItem = (email) => {
    if (email == "") {
      updateEmailError(true)
    }
    else updateEmailError(false)
    if(email!="" ) {
      //updateData([{ "username": email, "name": name }, ...data])
      processToken().then((token) => {
      axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/auth/company-signup', {
        username: email,
        password:"Password1234!"
        },{
        headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
        }
        })
        .then(response => {
          console.log(response.data);
          if (response.status == 200) {
            setRefresh(true)
          }
            //should populate shifts
            //updateData(response.data)
        })
        .catch(error => {
        console.error(error);
        });
      });
      setModalVisible(false)
    }
    }
  return (
    <View style={{ flex: 1}}>
        <FlatList data={data} keyExtractor={keyExtractor} ItemSeparatorComponent={() => <View style={{height: 10}} />} renderItem={(item,extraData) => {
        if (extraData != item.item) return <MyListItem item={item.item} removeItem={removeItem} updateOpenRefs={ updateOpenRefs} openRefs={openRefs} />;
      }} />
<View>
              {modalVisible && <Modal
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)} // Required for Android back button
                  animationType="fade" // Optional: 'none', 'slide', 'fade'
                  transparent={true} // Optional: Renders modal over a transparent background
              >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                          <View>
                              <TextInput placeholder="Company email" onChangeText={e => {
                                  updateEmail(e)
                              }} />
                              {emailError ? <Text style={{ color: "red" }}>Error with the email, must be non empty! </Text> : null}
                          </View>
                          <View style={{ display: "flex", flexDirection: "row" }}>
                              <View style={{ margin: 10 }}>
                                  <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                              </View>
                              <View style={{ margin: 10 }}>
                                  <Button title="Add" onPress={() => {
                                      openRefs.forEach((ref) => {
                                          ref.current?.close()
                                      })
                                      addItem(email)
                    
                                  }
                                  } />
                              </View>
                          </View>
                      </View>
                  </View>
              </Modal>}
              </View>
        <FloatingAction
          actions={  [{
    text: "Company",
    icon: <FontAwesome name="building" size={20} color="white" />,
    name: "company",
          }]}
        onPressItem={name => {
          if (name === "company") {
              setModalVisible(true)
            }
      console.log(`selected button: ${name}`);
    }}
  />
        </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        marginLeft: 10,
        padding: 10,
        margin:10,
        backgroundColor: "#C5C6D0",
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 20,
        shadowColor: '#52006A',
    },
    item: {
        fontWeight: "bold",
        fontSize: 20,
    }
});

export default AdminPage;
