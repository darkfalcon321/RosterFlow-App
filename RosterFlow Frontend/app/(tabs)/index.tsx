/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, TouchableOpacity,Text} from 'react-native';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
 import FontAwesome from '@expo/vector-icons/FontAwesome';
import User from './User';
import NewShifts from './NewShift';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import CompanyProfile from './CompanyProfile';
import ProfilePage from '../ProfilePage';
import MessageScreen from './message';
import Unavailability from '../Unavailability';
import UserShift from '../UserShift';

const Tab = createBottomTabNavigator();

//This page gets called when an user log in if it is an Admin
function HomeScreen() {
  //const isDarkMode = useColorScheme() === 'dark';
  const router = useRouter();
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
          tabbarVisible:false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName="user";
          let iconColor;
          if (route.name === 'Unavailability') {
            iconName = 'calendar';
            iconColor=focused?"red":"black"
          } else if (route.name === 'Profile') {
            iconName = 'user';
            iconColor=focused?"red":"black"
          }
          else if (route.name == "Shifts") {
            iconName = 'calendar';
            iconColor=focused?"red":"black"
          }
          else {
            iconName = 'comment';
            iconColor=focused?"red":"black"
          }
          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={30} color={iconColor} />;
        },
      tabBarActiveTintColor: 'tomato',
        
        tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Profile" component={ProfilePage} options={{
                              title: "Profile", headerShown: true, headerRight: () => {
                                  const { logout } = useAuth();
                                  return (<TouchableOpacity
                                      onPress={async() => {
                                          await logout()
                                          router.replace("/(login)/login")
                                      }
                                      }
                                      style={{ marginRight: 15 }}
                                  >
                                      <Text style={{ color: 'blue', fontSize: 16 }}>Logout</Text>
                                  </TouchableOpacity>);
        },
      }} />
            <Tab.Screen name="Shifts" component={UserShift} options={{
                              title: "Profile", headerShown: true, headerRight: () => {
                                  const { logout } = useAuth();
                                  return (<TouchableOpacity
                                      onPress={async() => {
                                          await logout()
                                          router.replace("/(login)/login")
                                      }
                                      }
                                      style={{ marginRight: 15 }}
                                  >
                                      <Text style={{ color: 'blue', fontSize: 16 }}>Logout</Text>
                                  </TouchableOpacity>);
                              },}}/>
      <Tab.Screen name="Unavailability" component={Unavailability} options={{
                              title: "Unavailability", headerShown: true, headerRight: () => {
                                  const { logout } = useAuth();
                                  return (<TouchableOpacity
                                      onPress={async() => {
                                          await logout()
                                          router.replace("/(login)/login")
                                      }
                                      }
                                      style={{ marginRight: 15 }}
                                  >
                                      <Text style={{ color: 'blue', fontSize: 16 }}>Logout</Text>
                                  </TouchableOpacity>);
        },
      }} />
      <Tab.Screen name="Message" component={MessageScreen} options={{
                              title: "Message", headerShown: true, headerRight: () => {
                                  const { logout } = useAuth();
                                  return (<TouchableOpacity
                                      onPress={async() => {
                                          await logout()
                                          router.replace("/(login)/login")
                                      }
                                      }
                                      style={{ marginRight: 15 }}
                                  >
                                      <Text style={{ color: 'blue', fontSize: 16 }}>Logout</Text>
                                  </TouchableOpacity>);
                              },}}/>
      </Tab.Navigator>
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

export default HomeScreen;
