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


function Counter({ currentDate }) {
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)
    const [isBefore,setIsBefore]=useState(false)

    const updateTime = () => {
        let now = new Date()
        if (now > currentDate) {
            setIsBefore(true)
        }
        else {
            setIsBefore(false)
        }
        let temp = Math.abs(Math.floor((currentDate.getTime() - now.getTime()) / 1000))
        let hours = Math.floor(temp / (60*60))
        temp=temp-hours*60*60
        let minutes = Math.floor(temp / 60)
        temp = Math.floor(temp - minutes * 60)
        setHours(hours)
        setMinutes(minutes)
        setSeconds(temp)
    }
    setInterval(updateTime, 1000)
    
  return (
      <View>
          {!isBefore? <Text>{hours<10?"0"+String(hours):hours}:{minutes<10?"0"+String(minutes):minutes}:{seconds<10?"0"+String(seconds):seconds}</Text>:<Text style={{color:"red"}}>{hours<10?"0"+String(hours):hours}:{minutes<10?"0"+String(minutes):minutes}:{seconds<10?"0"+String(seconds):seconds}</Text>}
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

export default Counter;
