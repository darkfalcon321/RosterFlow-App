import { View, Text } from "react-native";
import { StyleSheet, useColorScheme,FlatList, Modal,TouchableWithoutFeedback, Button, TextInput } from 'react-native';
import * as React from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FontAwesome } from '@expo/vector-icons';
import { FloatingAction } from "react-native-floating-action";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { getToken } from "@/services/AuthStorage";
import { Dropdown } from "react-native-element-dropdown";

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const showAlert = (item,removeItem,ref,updateOpenRefs,setRefresh) =>
  Alert.alert(
    'Delete',
    'Are you sure you want to delete '+item.label+"?",
    [
      {
        text: 'Yes',
        onPress: () => {
          //delete item
          //deleteItem()
          //element
          ref.current?.close()
          updateOpenRefs([])
          //removeItem(item)
          //add delete in the backend
          //TODO:this is already set up but a delete method for the user must be implemented
          /*
          const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
          axios.post(process.env.EXPO_PUBLIC_DOMAIN + 'api/auth/delete',item.value, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          })
            .then(response => {
              console.log(response.data);
              //should populate shifts
              setRefresh(true)
            })
            .catch(error => {
              console.error(error);
            });
            */
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



const MyListItem = ({item, removeItem,updateOpenRefs,openRefs,setRefresh}) => {
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
        showAlert(item,removeItem,swipeableRef,updateOpenRefs,setRefresh)
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
      <Text style={styles.item}>{item.label}</Text>
    </View></Swipeable>)
  return element
};

export default function User() {
//const isDarkMode = useColorScheme() === 'dark';
    type Item = {username: string,name:string};
    const n = 100
  //const users = { "username": "myemail@gmail.com", "name": "Giorgio Olivero" }
  const repeatedArray = [];

  let i = 0
  while (i < n) {
    repeatedArray.push({ "username": "memail@gmail.com", "name": "My name "+i })
    i+=1
  }
  
  const [data, updateData] = useState([])
  const [openRefs, updateOpenRefs] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [name, updateName] = useState("")
  const [selectedRole, setSelectedRole] = useState(null)
  const [role, setRole] = useState([{  label: 'Company', value: 'company'}, {label: 'User', value: 'user'}])
  const [email, updateEmail] = useState("")
  const [emailError, updateEmailError] = useState(false)
  const [nameError, updateNameError] = useState(false)
  const [refresh, setRefresh] = useState(true)

  React.useEffect(() => {
    if (refresh) {
      //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
      getToken().then((token) => {
      axios.get(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/company/shift/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          //'Content-Type': 'application/json',
        }
      })
        .then(response => {
          console.log(response.data);
          //should populate shifts
          updateData(response.data)
        })
        .catch(error => {
          console.error(error);
        });
        });
      setRefresh(false)
    }
    },[refresh])

  useEffect(() => {
    if (!modalVisible) {
      updateEmailError(false)
      updateNameError(false)
    }
      else if(modalVisible) console.log("Visible")
  },[modalVisible])
  const keyExtractor=(item:Item) => {return item.username}
  
  const removeItem = (item) => {
    updateData(data.filter(p => p.name !== item.name))
  }
  const addItem = (email) => {
    if (email == "") {
      updateEmailError(true)
    }
    else updateEmailError(false)
    // if (name == "") {
    //   updateNameError(true)
    // }
    // else {
    //   updateEmailError(true)
    // }
    if(email!="" && selectedRole!=null){
      //updateData([{ "username": email, "name": name }, ...data])
      //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
      //TODO: a random password should be generated and then changed at first login!
      let api = "api/auth/signup"
      if (selectedRole === "company") api = "api/auth/signup-subcompany"
      getToken().then((token) => {
      axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + api, {
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
    <View style={{height:"100%"}}>
        <FlatList data={data} keyExtractor={keyExtractor} renderItem={(item,extraData) => {
        if (extraData != item.item) return(<MyListItem item={item.item} setRefresh={setRefresh} removeItem={removeItem} updateOpenRefs={ updateOpenRefs} openRefs={openRefs} />);
          }} />
          <View>
          {modalVisible && <Modal
              //visible={modalVisible}
              onRequestClose={() => setModalVisible(false)} // Required for Android back button
              animationType="slide" // Optional: 'none', 'slide', 'fade'
              transparent={true} // Optional: Renders modal over a transparent background
          >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <View>
              
            </View>
            <View>
              <TextInput placeholder="User email" onChangeText={e => {
                updateEmail(e)
              }} />
              {emailError ?<Text style={{color:"red"}}>Error with the email, must be non empty! </Text>:null}
              </View>
            <Dropdown 
          data={role}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Select item'}
          searchPlaceholder="Search..."
          value={selectedRole}
                          onChange={item => {
              console.log(item)
            setSelectedRole(item.value)
          }}
                          />
            <View style={{ display: "flex", flexDirection: "row" }}>
                <View style={{margin:10}}>
                  <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              </View>
                <View style={{margin:10}}>
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
    text: "User",
    icon: <FontAwesome name="user" size={20} color="white" />,
    name: "user",
          }]}
        onPressItem={name => {
          if (name === "user") {
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
