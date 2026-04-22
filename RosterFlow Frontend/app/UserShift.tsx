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
function UserShift() {
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
    const [updateModal,setUpdateModal]=useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [dateComponent,setDateComponent]=useState(null)
    const [dateStartVisibility, setStartDateVisibility] = useState(false)
        const [dateEndVisibility, setEndDateVisibility] = useState(false)
    const [startVisibility, setStartVisibility] = useState(false)
    const [endVisibility, setEndVisibility] = useState(false)
    const [dateVisibility, setDateVisibility] = useState(false)
    /*
    React.useEffect(() => {
        console.log(date)
        const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
        axios.post(process.env.EXPO_PUBLIC_DOMAIN + 'api/user/shift/see',{date:date,username:process.env.EXPO_PUBLIC_USERNAME} ,{
        headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
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
    },[])
    */

    React.useEffect(() => {
            //const token = process.env.EXPO_PUBLIC_BACKEND_URL; // Replace with your actual token
      getToken().then((token) => {
        console.log("date",date.toISOString().split("T")[0])
        axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + 'api/user/shift/see', { date: date.toISOString().split("T")[0] }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
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
      });
    },[date])

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
        {shifts == null || shifts.length == 0 ? <View style={{ padding: 10 }}><Text>There are no shifts.</Text></View> : <FlatList data={shifts} renderItem={(item) => {
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
          return (<View style={{ backgroundColor: "white", margin: 10, borderRadius: 8 }}>
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{item.item.username}</Text>
              <Text>From: {startDate.toLocaleTimeString()}</Text>
              <Text>To:{dateToString(endDate)} {endDate.toLocaleTimeString()}</Text>
            </View>
          </View>);
        }} />}
          </View>
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

export default UserShift;
