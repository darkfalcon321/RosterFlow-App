/*
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { getToken } from "@/services/AuthStorage";

export default function Unavailability() {
  const username = "sadikshya@gmail.com"; // Replace with logged-in username

  // State
  const [items, setItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const [unavailStartDate, setUnavailStartDate] = useState(new Date());
  const [unavailEndDate, setUnavailEndDate] = useState(new Date());
  const [unavailStartTime, setUnavailStartTime] = useState(new Date());
  const [unavailEndTime, setUnavailEndTime] = useState(new Date());

  const [startDateVisibility, setStartDateVisibility] = useState(false);
  const [endDateVisibility, setEndDateVisibility] = useState(false);
  const [startTimeVisibility, setStartTimeVisibility] = useState(false);
  const [endTimeVisibility, setEndTimeVisibility] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const API_DOMAIN = process.env.EXPO_PUBLIC_BACKEND_URL;
  //const TOKEN = process.env.EXPO_PUBLIC_BACKEND_URL;
  console.log("Domain:", API_DOMAIN);
  //console.log("Token:", TOKEN);

  // Fetch unavailability entries
  const fetchUnavailability = async () => {
    try {
      getToken().then(async(token) => {
        const response = await axios.get(
          API_DOMAIN + "api/user/unavailability/see",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              //"Content-Type": "application/json",
            },
          }
        ).then((response) => {
          setItems(response.data);
        });
      });
    //console.log("Fetched unavailability:", response.data); // 👈 helps confirm
    
  } catch (error: any) {
    console.error("Fetch error:", error.response?.data || error.message);
  }
};

  useEffect(() => {
    fetchUnavailability();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchUnavailability();
      setRefresh(false);
    }
  }, [refresh]);

  // Add or update entry
 const saveUnavailability = async () => {
  const payload = {
    //username: username, // must match Swagger
    startDate: unavailStartDate.toISOString(),
    endDate: unavailEndDate.toISOString(),
  };

   try {
     getToken().then(async (token) => {
       console.log(unavailStartDate.toISOString(),unavailEndDate.toISOString())
       await axios.post(API_DOMAIN + "api/user/unavailability/add", payload, {
         headers: { Authorization: `Bearer ${token}` },
       });
     });
    setRefresh(true);          // refresh the list after adding
    setModalVisible(false);    // close modal
  } catch (error: any) {
    console.error("Add error:", error.response?.data || error.message);
  }
};


  // Delete entry
  const deleteUnavailability = async (id: number) => {
    try {
      getToken().then(async(token) => {
        await axios.post(
          `${API_DOMAIN}api/user/unavailability/delete`,
          id, // raw number as body
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRefresh(true); // refresh the list after deletion
      });
  } catch (error: any) {
    console.error("Delete error:", error.response?.data || error.message);
  }
};


  // Edit entry
  const editEntry = (entry: any) => {
  setEditingEntry(entry);
  setUnavailStartDate(new Date(entry.startDate));
  setUnavailEndDate(new Date(entry.endDate));
  setModalVisible(true);
};

const modifyUnavailability = async () => {
  if (!editingEntry) return;

  const payload = {
    id: editingEntry.id,
    startDate: unavailStartDate.toISOString(),
    endDate: unavailEndDate.toISOString(),
  };
  console.log(payload)

  try {
    getToken().then(async (token) => {
      await axios.post(
        `${API_DOMAIN}api/user/unavailability/modify`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });
    setRefresh(true);       // refresh the list
    setEditingEntry(null);  // reset editing state
    setModalVisible(false); // close modal
  } catch (error: any) {
    console.error("Modify error:", error.response?.data || error.message);
  }
};

  return (
    <View style={{ flex: 1,height:"100%",width:"100%", padding: 20 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          let startDate = new Date(item.startDate)
                  let endDate = new Date(item.endDate)
                    const offsetMinutes = new Date().getTimezoneOffset();
                    const offsetHours = offsetMinutes / 60;
                  startDate.setHours(startDate.getHours() - offsetHours)
                  endDate.setHours(endDate.getHours() - offsetHours)
          return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => editEntry(item)}
            onLongPress={() =>
              Alert.alert(
                "Confirm Delete",
                "Do you want to delete this unavailability?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: () => deleteUnavailability(item.id) },
                ]
              )
            }
          >
            <Text style={styles.cardText}>
              {new Date(startDate).toLocaleDateString()} →{" "}
              {new Date(endDate).toLocaleDateString()} — {item.name} (
              {new Date(startDate).toLocaleTimeString()} -{" "}
              {new Date(endDate).toLocaleTimeString()})
            </Text>
          </TouchableOpacity>
        )}}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Unavailability</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.inputButton} onPress={() => setStartDateVisibility(true)}>
              <Text>Start Date: {unavailStartDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {startDateVisibility && (
              <DateTimePicker
                value={unavailStartDate}
                mode="date"
                onChange={(event, date) => {
                  if (date) setUnavailStartDate(date);
                  setStartDateVisibility(false);
                }}
              />
            )}

            <TouchableOpacity style={styles.inputButton} onPress={() => setEndDateVisibility(true)}>
              <Text>End Date: {unavailEndDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {endDateVisibility && (
              <DateTimePicker
                value={unavailEndDate}
                mode="date"
                onChange={(event, date) => {
                  if (date) setUnavailEndDate(date);
                  setEndDateVisibility(false);
                }}
              />
            )}

            <TouchableOpacity style={styles.inputButton} onPress={() => setStartTimeVisibility(true)}>
              <Text>Start Time: {unavailStartTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {startTimeVisibility && (
              <DateTimePicker
                value={unavailStartTime}
                mode="time"
                onChange={(event, date) => {
                  if (date) setUnavailStartTime(date);
                  setStartTimeVisibility(false);
                }}
              />
            )}

            <TouchableOpacity style={styles.inputButton} onPress={() => setEndTimeVisibility(true)}>
              <Text>End Time: {unavailEndTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {endTimeVisibility && (
              <DateTimePicker
                value={unavailEndTime}
                mode="time"
                onChange={(event, date) => {
                  if (date) setUnavailEndTime(date);
                  setEndTimeVisibility(false);
                }}
              />
            )}

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Button
                        title={editingEntry ? "Update" : "Add"}
                        onPress={editingEntry ? modifyUnavailability : saveUnavailability}
                          />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffe6e6",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  cardText: { fontSize: 16, color: "#cc0000" },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 50,
    backgroundColor: "#cc0000",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  inputButton: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
});

*/

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { getToken } from "@/services/AuthStorage";

export default function Unavailability() {
  const username = "anjan@gmail.com"; // Replace with logged-in username

  // ---------------- State Variables ----------------
  const [items, setItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const [unavailStartDate, setUnavailStartDate] = useState(new Date());
  const [unavailEndDate, setUnavailEndDate] = useState(new Date());
  const [unavailStartTime, setUnavailStartTime] = useState(new Date());
  const [unavailEndTime, setUnavailEndTime] = useState(new Date());

  const [startDateVisibility, setStartDateVisibility] = useState(false);
  const [endDateVisibility, setEndDateVisibility] = useState(false);
  const [startTimeVisibility, setStartTimeVisibility] = useState(false);
  const [endTimeVisibility, setEndTimeVisibility] = useState(false);

  const [refresh, setRefresh] = useState(true);

  const API_DOMAIN = process.env.EXPO_PUBLIC_DOMAIN;
  const TOKEN = process.env.EXPO_PUBLIC_TOKEN;

  // ---------------- Combine Date + Time ----------------
  const combineDateTime = (date: Date, time: Date): Date => {
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return combined;
  };

  // ---------------- Format Local DateTime (Fix UTC shift) ----------------
  const formatLocalDateTime = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
    const localISOTime = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 19);
    return localISOTime;
  };

  // ---------------- Fetch Unavailability ----------------
  const fetchUnavailability = async () => {
    try {
      getToken().then(async(token) => {
        const response = await axios.get(
          process.env.EXPO_PUBLIC_BACKEND_URL + "api/user/unavailability/see",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              //"Content-Type": "application/json",
            },
          }
        ).then((response) => {
          setItems(response.data);
        });
      });
    } catch (error: any) {
      console.error("Fetch error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (refresh) {
      console.log("Refresh")
      fetchUnavailability();
      setRefresh(false)
    }
  }, [refresh]);

  // ---------------- Add New Entry ----------------
  const saveUnavailability = async () => {
    const startDateTime = combineDateTime(unavailStartDate, unavailStartTime);
    const endDateTime = combineDateTime(unavailEndDate, unavailEndTime);

    const payload = {
      username,
      startDate: formatLocalDateTime(startDateTime),
      endDate: formatLocalDateTime(endDateTime),
    };

    try {
      getToken().then(async (token) => {
        console.log(unavailStartDate.toISOString(), unavailEndDate.toISOString())
        console.log(payload)
       await axios.post(process.env.EXPO_PUBLIC_BACKEND_URL + "api/user/unavailability/add", payload, {
         headers: { Authorization: `Bearer ${token}` },
       }).then((response) => {
         console.log(response.data)
         setRefresh(true);
         setModalVisible(false);
       });
     });
    } catch (error: any) {
      console.error("Add error:", error.response?.data || error.message);
      Alert.alert("Add error", error.response?.data || error.message);
    }
  };

  // ---------------- Delete Entry ----------------
  const deleteUnavailability = async (id: number) => {
    try {
      getToken().then(async (token) => {
        console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL}api/user/unavailability/delete`)
        axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}api/user/unavailability/delete`,
          id, // raw number as body
          {
            headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json", },
          }
        ).then((response) => {
          console.log(response.data)
          setRefresh(true); // refresh the list after deletion
        });
        
      });
    } catch (error: any) {
      console.log("Deleting id:", id);
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Unavailability", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteUnavailability(id),
      },
    ]);
  };

  // ---------------- Edit Entry ----------------
  const editEntry = (entry: any) => {
    setEditingEntry(entry);
    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);

    setUnavailStartDate(start);
    setUnavailEndDate(end);
    setUnavailStartTime(start);
    setUnavailEndTime(end);

    setModalVisible(true);
  };

  const modifyUnavailability = async () => {
    if (!editingEntry) return;

    const startDateTime = combineDateTime(unavailStartDate, unavailStartTime);
    const endDateTime = combineDateTime(unavailEndDate, unavailEndTime);

    const payload = {
      id: editingEntry.id,
      startDate: formatLocalDateTime(startDateTime),
      endDate: formatLocalDateTime(endDateTime),
    };

    try {
      getToken().then(async (token) => {
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}api/user/unavailability/modify`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((response) => {
        console.log(response.data)
        setRefresh(true);       // refresh the list
        setEditingEntry(null);  // reset editing state
        setModalVisible(false); // close modal
      });
    });
    } catch (error: any) {
      console.error("Modify error:", error.response?.data || error.message);
    }
  };

  // ---------------- Render ----------------
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {/* Unavailability List */}
      {items == null || items.length == 0 ? <View style={{ padding: 10 }}><Text>No unavailability</Text></View> : <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const start = new Date(item.startDate);
          const end = new Date(item.endDate);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => editEntry(item)}
              onLongPress={() => handleDelete(item.id)}
            >
              <Text style={styles.cardText}>
                Start: {start.toLocaleDateString()} {start.toLocaleTimeString()} →{" "}
                End: {end.toLocaleDateString()} {end.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingEntry(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Unavailability</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Start Date */}
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setStartDateVisibility(true)}
            >
              <Text>Start Date: {unavailStartDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {startDateVisibility && (
              <DateTimePicker
                value={unavailStartDate}
                mode="date"
                onChange={(event, date) => {
                  if (date) setUnavailStartDate(date);
                  setStartDateVisibility(false);
                }}
              />
            )}

            {/* End Date */}
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setEndDateVisibility(true)}
            >
              <Text>End Date: {unavailEndDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {endDateVisibility && (
              <DateTimePicker
                value={unavailEndDate}
                mode="date"
                onChange={(event, date) => {
                  if (date) setUnavailEndDate(date);
                  setEndDateVisibility(false);
                }}
              />
            )}

            {/* Start Time */}
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setStartTimeVisibility(true)}
            >
              <Text>Start Time: {unavailStartTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {startTimeVisibility && (
              <DateTimePicker
                value={unavailStartTime}
                mode="time"
                onChange={(event, time) => {
                  if (time) setUnavailStartTime(time);
                  setStartTimeVisibility(false);
                }}
              />
            )}

            {/* End Time */}
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() => setEndTimeVisibility(true)}
            >
              <Text>End Time: {unavailEndTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {endTimeVisibility && (
              <DateTimePicker
                value={unavailEndTime}
                mode="time"
                onChange={(event, time) => {
                  if (time) setUnavailEndTime(time);
                  setEndTimeVisibility(false);
                }}
              />
            )}

            {/* Buttons */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Button
                  title={editingEntry ? "Update" : "Add"}
                  onPress={
                    editingEntry ? modifyUnavailability : saveUnavailability
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffe6e6",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  cardText: { fontSize: 16, color: "#cc0000" },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 50,
    backgroundColor: "#cc0000",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  inputButton: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
});
