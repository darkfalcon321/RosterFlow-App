/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Text, TouchableOpacity, View,StyleSheet, SafeAreaView, Modal, TextInput, Button, Pressable, Alert} from 'react-native';
import * as React from 'react';
import { FloatingAction } from 'react-native-floating-action';
 import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeviceInfo from 'react-native-device-info';
import { Dropdown } from 'react-native-element-dropdown';
import { FlatList } from 'react-native-gesture-handler';
import { it } from 'node:test';
import axios from 'axios';
import { getToken } from '@/services/AuthStorage';

//This page gets called when an user log in if it is an Admin
function NewShifts({route}) {
  // once we connect the backend we will use onDayPressed and when a new date is selected there will be an API call to fetch the items for that specific date
  //initially items=[]
    const [date, setDate] = useState(new Date())
    const [shiftStartDate, setShiftStartDate] = useState(new Date())
     const [shiftEndDate, setShiftEndDate] = useState(new Date())
  const [start, setStart] = useState(false)
    const [end, setEnd] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const currentDate = new Date();
    const [users, setUsers] = useState([])
    const [shifts, setShifts] = useState([])
    const [refresh, setRefresh] = useState(false)
    const {subcompany} = route.params
    const newData = {
          '2025-08-30': [{ name: 'Giorgio', day: '2025-08-20', time: '10:00 AM - 5:00 PM' }, { name: 'Mark', day: '2025-08-20', time: '5:00 PM - 5:30 PM' }, { name: 'Loma', day: '2025-08-20', time: '5:30 PM - 7:00 PM' }],
    }
    const [items, setItems] = useState({
          '2025-08-20': [{ name: 'Giorgio', day: '2025-08-20', time: '10:00 AM - 5:00 PM' }, { name: 'Mark', day: '2025-08-20', time: '5:00 PM - 5:30 PM' }, { name: 'Loma', day: '2025-08-20', time: '5:30 PM - 7:00 PM' }],
          '2025-08-21': [{ name: 'Giorgio', day: '2025-08-21', time: '10:00 AM - 5:00 PM' }],
          '2025-08-22': [{ name: 'Giorgio', day: '2025-08-22', time: '10:00 AM - 5:00 PM' }],
          '2025-08-23': [{ name: 'Giorgio', day: '2025-08-23', time: '10:00 AM - 5:00 PM' }],
          '2025-08-24': [{ name: 'Giorgio', day: '2025-08-24', time: '10:00 AM - 5:00 PM' }, { name: 'Mark', day: '2025-08-24', time: '5:00 PM - 5:30 PM' }, { name: 'Loma', day: '2025-08-24', time: '5:30 PM - 7:00 PM' }]
    })
    const [updateModal,setUpdateModal]=useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [name, updateName] = useState("")
    const [dateComponent,setDateComponent]=useState(null)
    const [dateStartVisibility, setStartDateVisibility] = useState(false)
        const [dateEndVisibility, setEndDateVisibility] = useState(false)
    const [startVisibility, setStartVisibility] = useState(false)
    const [endVisibility, setEndVisibility] = useState(false)
    const [dateVisibility, setDateVisibility] = useState(false)
    const [emailError, updateEmailError] = useState(false)
    const [nameError, updateNameError] = useState(false)
    
    const modifyShift = (startDay, endDay, name,id) => {
        //console.log(shifts)
        //console.log(name)
        console.log(name)
        console.log(id)
        let result = shifts.filter(item=>item.id!==id)
        let user = users.filter(item => item.value === selectedUser)[0]
        console.log(user)
        let temp = new Date(startDay.toISOString())
        const offsetMinutes = new Date().getTimezoneOffset();
        const offsetHours = offsetMinutes / 60;
        temp.setHours(temp.getHours() - offsetHours)
        let data_to_send={id: id, startDate: startDay.toISOString(), endDate: endDay.toISOString(),date:temp.toISOString().split("T")[0] }
        if (result!== undefined) result= [...result, {id:id, username: user.label, startDate: startDay.toISOString(), endDate: endDay.toISOString() }]
        else result = [{ id:1,username: user.label, startDate: startDay.toISOString(), endDate: endDay.toISOString() }]
        setModalVisible(false)
        console.log(result)
        //setShifts(result)
        //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
        getToken().then((token) => {
        axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/company/shift/modify', data_to_send ,{
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
            //setShifts(response.data)
        })
        .catch(error => {
        console.error(error);
        });
        });
    //fetch data and update state setItems()
    }

    const addShift = () => {
        //console.log(shifts)
        //console.log(name)
        console.log("looool")
        console.log(shiftStartDate)
        console.log(shiftEndDate)
        let result = shifts
        console.log("Selected user: "+selectedUser)
        let user=users.filter(item=>item.value===selectedUser)[0]
        console.log(users.filter(item => item.value === name))
        console.log("Here")
        
        let temp = new Date(shiftStartDate.toISOString())
        const offsetMinutes = new Date().getTimezoneOffset();
        const offsetHours = offsetMinutes / 60;
        temp.setHours(temp.getHours() - offsetHours)
        console.log(selectedUser)
        let data_to_send={username: user.label, startDate: shiftStartDate.toISOString(), endDate: shiftEndDate.toISOString(),date:temp.toISOString().split("T")[0] }
        //TODO:the if has to be modified and a post request has to be made!!!
        setModalVisible(false)
        console.log(result)
        //setShifts(result)
        //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
        getToken().then((token) => {
        console.log(data_to_send)
        axios.post(process.env.EXPO_PUBLIC_BACKEND_URL+'api/company/shift/add', data_to_send, {
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
            
        })
        .catch(error => {
        console.error(error);
        });
        });
    //fetch data and update state setItems()
    }

    React.useEffect(() => {
        console.log(date)
        //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
        getToken().then((token) => {
            let url = "api/company/shift/users"
            if (subcompany) url = "api/company/shift/users_subcompany"
        axios.get(process.env.EXPO_PUBLIC_BACKEND_URL + url,{
        headers: {
                'Authorization': `Bearer ${token}`,
                //'Content-Type': 'application/json',
        }
        })
        .then(response => {
            console.log(response.data);
            //should populate shifts
            setUsers(response.data)
        })
        .catch(error => {
        console.error(error);
        });
        });
    },[])

    React.useEffect(() => {
        console.log(date)
        if (refresh) {
            //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
            getToken().then((token) => {
                let url = 'api/company/shift/see'
                if (subcompany) url = 'api/company/shift/see_subcompany'
                console.log(url)
                axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + url, { date: date }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        //should populate shifts
                        setShifts(response.data)
                    })
                    .catch(error => {
                        console.error(error);
                    });
                setRefresh(false)
            })
        }
    },[date,refresh])

    React.useEffect(() => {
        console.log("date updated")
        setDateComponent(<View style={{width:"60%",alignContent:"center",alignItems:"center",justifyContent:"center"}}>
                  <Pressable onPress={() => setDateVisibility(true)}><Text>{ dateToString(date)}</Text></Pressable>
              </View>)
    },[updateModal])
    React.useEffect(() => {
        console.log("date updated")
        setDateComponent(<View style={{width:"60%",alignContent:"center",alignItems:"center",justifyContent:"center"}}>
                  <Pressable onPress={() => setDateVisibility(true)}><Text>{ dateToString(date)}</Text></Pressable>
        </View>)
        setRefresh(true)
    },[date])
  const onDayPress = (day) => {
      console.log(day.dateString)
      setDate(new Date(day.dateString))
    //fetch data and update state setItems()
  }
    const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setStart(true); // Hide picker after selection
    };

    const convertDay = (day) => {
        let weekDay=""
        if (day === 0) weekDay = "Sunday"
        else if (day === 1) weekDay = "Monday"
        else if (day === 2) weekDay = "Tuesday"
        else if (day === 3) weekDay = "Wednesday"
        else if (day === 4) weekDay = "Thursday"
        else if (day === 5) weekDay = "Friday"
        else if (day === 6) weekDay = "Saturday"
        return weekDay
    }

    const convertMonth = (month) => {
        let convMonth=""
        if (month === 0) convMonth = "January"
        else if (month === 1) convMonth = "February"
        else if (month === 2) convMonth = "March"
        else if (month === 3) convMonth = "April"
        else if (month === 4) convMonth = "May"
        else if (month === 5) convMonth = "June"
        else if (month === 6) convMonth = "July"
        else if (month === 7) convMonth = "August"
        else if (month === 8) convMonth = "September"
        else if (month === 9) convMonth = "October"
        else if (month === 10) convMonth = "November"
        else if (month === 11) convMonth = "December"
        return convMonth
    }
    
    const dateToString = ( date:Date) => {
        const day = convertDay(date.getDay())
        const month = date.getMonth()
        return day + ", " + date.getDate() + " " + convertMonth(month)+", "+date.getFullYear()
    }
  //selected mus be changed to today's date
  return (
      <SafeAreaView style={styles.container}>
          <View style={{display:"flex",flexDirection:"row",height:"10%",width:"100%",borderBottomWidth:1,backgroundColor:"#F0FFFF"} }>
              <View style={{width:"20%",alignContent:"center",alignItems:"center",justifyContent:"center"}}>
                  <FontAwesome name={"angle-left"} size={30} color="black" onPress={() => {
                      console.log("Go back!")
                      let temp = new Date(date.toISOString())
                      temp.setDate(temp.getDate() - 1)
                      console.log(temp.toISOString())
                      setDate(temp)
                  }
                  } />
              </View>
              {dateComponent}
              {dateVisibility && <DateTimePicker is24Hour={true} value={date} mode='date' onChange={(event, selectedDate) => {
                              if (selectedDate) setDate(selectedDate)
                              setDateVisibility(false)
                          }} />}
              <View style={{width:"20%",alignContent:"center",alignItems:"center",justifyContent:"center"}}>
                  <FontAwesome name={"angle-right"} size={30} color="black" onPress={() => {
                      console.log("Go forward!")
                      let temp = new Date(date.toISOString())
                      temp.setDate(temp.getDate() + 1)
                      console.log(temp.toISOString())
                      setDate(temp)
                  }
                  } />
            </View>
          </View>
          <View style={{ height: "90%", width: "100%"}}>
              {shifts==null || shifts.length==0?<View style={{padding:10}}><Text>There are no shifts.</Text></View>:<FlatList data={shifts} renderItem={(item) => {
                  let startDate = new Date(item.item.startDate)
                  let endDate = new Date(item.item.endDate)
                  const offsetMinutes = new Date().getTimezoneOffset();
                  const offsetHours = offsetMinutes / 60;
                  startDate.setHours(startDate.getHours() - offsetHours)
                  endDate.setHours(endDate.getHours() - offsetHours)
                  //   const offsetMinutes = new Date().getTimezoneOffset();
                  //   const offsetHours = offsetMinutes / 60;
                  //   console.log(startDate)
                  //   startDate.setHours(startDate.getHours() - offsetHours)
                  //   endDate.setHours(endDate.getHours()-offsetHours)
                  return (<Pressable onPress={() => {
                      //modify
                      console.log("modal popping up")
                      setSelectedId(item.item.id)
                      setModalVisible(true)
                      console.log(item.item)
                      setUpdateModal(true)
                      console.log("ciao", startDate, endDate)
                      //has to be changed with actual users
                      console.log(item.item.id)
                      console.log(users.filter(user => console.log(user.value))[0])
                      setSelectedUser(users.filter(user => user.label == item.item.username)[0].value)
                      setShiftStartDate(startDate)
                      setShiftEndDate(endDate)
                      setStartTime(startDate.toLocaleTimeString())
                      setEndTime(endDate.toLocaleTimeString())
                      //pass data to the modal
                  }} onLongPress={() => {
                      //ask for delete
                      console.log("Do you want to delete?")
                      Alert.alert(
                          'Confirm Action',
                          'Are you sure you want to delete this item?',
                          [
                              { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
                              {
                                  text: 'OK', onPress: () => {
                                      console.log('OK Pressed')
                                      let shiftId = item.item.id
                                      //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
                                      getToken().then((token) => {
                                          axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/company/shift/delete', shiftId, {
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
                                                  //setShifts(response.data)
                                              })
                                              .catch(error => {
                                                  console.error(error);
                                              });
                                      });
                                      //let result = shifts.filter(item => item.id !== shiftId)
                                      //setShifts([...result])
                                  }
                              },
                          ]
                      );
                  }}><View style={{ backgroundColor: "white", margin: 10, borderRadius: 8 }}>
                          <View style={{ padding: 10 }}>
                              <Text style={{ fontWeight: "bold" }}>{item.item.username}</Text>
                              <Text>From: {startDate.toLocaleTimeString()}</Text>
                              <Text>To:{dateToString(endDate)} {endDate.toLocaleTimeString()}</Text>
                              {subcompany && <Text>Approved:{item.item.approved ? "Yes" : "No"}</Text>}
                              {!item.item.approved && !subcompany && <View style={{ width: "30%" }}><Button title='Approve' onPress={() => {
                                  getToken().then((token) => {
                                      axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/company/shift/approve', item.item.id, {
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
                                              //setShifts(response.data)
                                          })
                                          .catch(error => {
                                              console.error(error);
                                          });
                                  });
                              }} /></View>}
                          </View>
                      </View></Pressable>);
              }} />}
          </View>
          {modalVisible && <Modal
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)} // Required for Android back button
              animationType="fade" // Optional: 'none', 'slide', 'fade'
              transparent={true} // Optional: Renders modal over a transparent background
          >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                  <View>
                      <Dropdown 
          data={users}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Select item'}
          searchPlaceholder="Search..."
          value={selectedUser}
                          onChange={item => {
              console.log(item)
            setSelectedUser(item.value)
          }}
                          />
                          </View>
                      <View>
                          <TextInput  placeholder={"Start: "+shiftStartDate.toDateString()} onPress={() => setStartDateVisibility(true)} />
                          {dateStartVisibility && <DateTimePicker value={shiftStartDate?shiftStartDate:new Date()} mode='date' onChange={(event, selectedDate) => {
                              if (selectedDate) setShiftStartDate(selectedDate)
                              console.log(selectedDate)
                              setStartDateVisibility(false)
                          }} />}
                      </View>
                      <View>
                      <TextInput placeholder='Start time' onPress={() => setStartVisibility(true)} value={shiftStartDate?(new Date(shiftStartDate).toLocaleTimeString()):undefined} />
                          {startVisibility && <DateTimePicker is24Hour={true} value={shiftStartDate?shiftStartDate:new Date()} mode='time' onChange={(event, selectedDate) => {
                              //console.log(date.getTimezoneOffset() / 60)
                              //TODO: this is very important as when i upload a shift I need to put UTC time!!!
                              if (selectedDate) {
                                  console.log("bug")
                                  console.log(selectedDate)
/*                                     const offsetMinutes = new Date().getTimezoneOffset();
                                    const offsetHours = offsetMinutes / 60;
                                    selectedDate.setHours(selectedDate.getHours() + offsetHours) */
                                  setShiftStartDate(selectedDate)
                                  console.log(selectedDate)
                              }
                              setStartVisibility(false)
                          }} />}
                      </View>
                    <View>
                          <TextInput  placeholder={"End: "+shiftEndDate.toDateString()} onPress={() => setEndDateVisibility(true)} />
                          {dateEndVisibility && <DateTimePicker value={shiftEndDate?shiftEndDate:new Date()} mode='date' onChange={(event, selectedDate) => {
                              if (selectedDate) setShiftEndDate(selectedDate)
                              console.log(selectedDate)
                              setEndDateVisibility(false)
                          }} />}
                      </View>
                      <View>
                      <TextInput placeholder='End time' onPress={() => setEndVisibility(true)} value={shiftEndDate?(new Date(shiftEndDate).toLocaleTimeString()):undefined} />
                          {endVisibility && <DateTimePicker is24Hour={true} value={shiftEndDate?shiftEndDate:new Date()} mode='time' onChange={(event, selectedDate) => {
                              if (selectedDate) {
/*                                     const offsetMinutes = new Date().getTimezoneOffset();
                                    const offsetHours = offsetMinutes / 60;
                                    selectedDate.setHours(selectedDate.getHours() - offsetHours) */
                                    setShiftEndDate(selectedDate)
                              }
                              setEndVisibility(false)
                          }} />}
                      </View>
                  
                      <View style={{ display: "flex", flexDirection: "row" }}>
                          <View style={{ margin: 10 }}>
                              <Button title="Cancel" color="red" onPress={() => {
                                  setModalVisible(false)
                                  setShiftStartDate(new Date())
                                  setShiftEndDate(new Date())
                                  setStartTime(null)
                                  setEndTime(null)
                                  setSelectedUser(null)
                                  setUpdateModal(false)
                                  setSelectedId(null)
                              }
                              } />
                          </View>
                          <View style={{ margin: 10 }}>
                              {!updateModal ? <Button title="Add" onPress={() => {
                                  if (selectedUser) {
                                      addShift()
                                      setUpdateModal(false)
                                      setShiftStartDate(new Date())
                                      setShiftEndDate(new Date())
                                      setStartTime(null)
                                      setEndTime(null)
                                      setSelectedUser(null)
                                      setSelectedId(null)
                                  }
                                  else {
                                      Alert.alert(
                                        'Error',
                                        'You have to choose an user to assign the shift!',
                                        [
                                            { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
                                            {
                                                text: 'OK', onPress: () => {
                                                    console.log('OK Pressed')
                                                }
                                                },
                                        ]
                                        );
                                  }
                                  
                              }
                              } /> : <Button title="Update" onPress={() => {
                                      //setModalVisible(false)
                                      modifyShift(shiftStartDate, shiftEndDate,selectedUser,selectedId)
                                      setUpdateModal(false)
                                      setSelectedUser(null)
                                  setShiftStartDate(new Date())
                                  setShiftEndDate(new Date())
                                  setStartTime(null)
                                      setEndTime(null)
                                      setSelectedId(null)
                                      //
                              }
                              } />}
                          </View>
                      </View>
                  </View>
              </View>
          </Modal>}
                  
              <FloatingAction
                actions={  [{
          text: "Add Shift",
          icon: <FontAwesome name="calendar" size={20} color="white" />,
          name: "user",
                }]}
        onPressItem={name => {
                setStart(true)
                if (name === "user") {
                    setModalVisible(true)
                  }
            console.log(`selected button: ${name}`);
          }}
        />
      </SafeAreaView>
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

export default NewShifts;
