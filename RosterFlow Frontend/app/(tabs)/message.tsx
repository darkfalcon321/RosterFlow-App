// app/(tabs)/message.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import axios from "axios";
import CommentSection from "../../components/CommentSection"; // ✅ same component
import { getToken } from "@/services/AuthStorage";

type Comment = {
  id: string;
  author: string;
  text: string;
  time: string;
};

type Message = {
  id: string;
  author: string;
  title: string;
  text: string;
  time: string;
  comments: Comment[];
};

export default function MessageScreen() {
  const username = "anjan@gmail.com"; // 🔹 Replace with dynamic user if needed

  const [messages, setMessages] = useState<Message[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const API_DOMAIN = process.env.EXPO_PUBLIC_DOMAIN;
  const TOKEN = process.env.EXPO_PUBLIC_TOKEN;

  // ------------------ Fetch All Messages ------------------
  const fetchMessages = async () => {
    try {
      getToken().then(async (token) => {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}api/message/posts`, {
          headers: { Authorization: `Bearer ${token}`,'Content-Type': 'application/json', },
        }).then((response) => {
        console.log(response.data)
        const formatted = response.data.map((msg: any) => ({
        id: msg.id.toString(),
        author: msg.authorUsername || "Unknown", // ✅ corrected field
        title: msg.title,
        text: msg.content,
        time: new Date(msg.createdAt || Date.now()).toLocaleString(),
        comments: msg.comments
          ? msg.comments.map((c: any) => ({
              id: c.id.toString(),
              author: c.authorUsername || "Anonymous", // ✅ corrected field
              text: c.content,
              time: new Date(c.createdAt || Date.now()).toLocaleString(),
            }))
          : [],
      }));

      setMessages(formatted);
        });
      });
    } catch (err: any) {
      console.error("Fetch Messages Error:", err.response?.data || err.message);
      Alert.alert("Error", "Could not load messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ------------------ Add New Message ------------------
  const addMessage = async () => {
    if (newTitle.trim() === "" || newMessage.trim() === "") {
      Alert.alert("Error", "Please enter a title and message.");
      return;
    }

    try {
      getToken().then(async (token) => {
        //console.log(`${process.env.EXPO_PUBLIC_BACKEND_URL}api/message/post?title=${newTitle}&content=${newMessage}`)
        await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}api/message/post`,null,
          {
            params: {
              title: newTitle,
              content:newMessage
            },
            headers: {
              Authorization: `Bearer ${token}`,

            },
          }
        ).then((response) => {
          Alert.alert("Success", "Message posed sucessfully!");
          setNewMessage("");
          setNewTitle("");
          setModalVisible(false);
          fetchMessages();
        });
      });
    } catch (err: any) {
      console.error("Add Message Error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to pst message.");
    }
  };

  // ------------------ Add Comment ------------------
  const addComment = async (text: string) => {
    if (!selectedMessage) return;

    try {
      getToken().then(async (token) => {
        console.log(selectedMessage.id)
        await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}api/message/comment/${selectedMessage.id}`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { content: text },
          }
        );
      }).then((response) => {
        fetchMessages(); // refresh list
      getToken().then(async (token) => {
        const updated = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}api/message/post/${selectedMessage.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then((response) => {
          console.log("here")
          console.log(response.data);
          const msg = response.data;
          setSelectedMessage({
            id: msg.id.toString(),
            author: msg.authorUsername || "Unknown",
            title: msg.title,
            text: msg.content,
            time: new Date(msg.createdAt || Date.now()).toLocaleString(),
            comments: msg.comments.map((c: any) => ({
              id: c.id.toString(),
              author: c.authorUsername || "Anonymous",
              text: c.content,
              time: new Date(c.createdAt || Date.now()).toLocaleString(),
            })),
          });
        });
      });
      });
      
    } catch (err: any) {
      console.error("Add Comment Error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to post comment.");
    }
  };

  // ------------------ UI Render ------------------
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat Section</Text>

      {/* Message list */}
      {messages == null || messages.length == 0 ? <View style={{ flex:1,padding: 10 }}><Text style={{color:"white"}}>No posts are present.</Text></View> : <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.messageTitle}>{item.title}</Text>
            <Text style={styles.message}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>

            <TouchableOpacity
              onPress={() => {
                setSelectedMessage(item);
                setCommentModalVisible(true);
              }}
              style={styles.commentBtn}
            >
              <Text style={styles.commentBtnText}>
                {item.comments.length === 0
                  ? "No Comments"
                  : `View Comments (${item.comments.length})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />}

      {/* Add message button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addBtn}
      >
        <Text style={styles.addBtnText}>+ New Message</Text>
      </TouchableOpacity>

      {/* Modal for new message */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <BlurView intensity={80} tint="dark" style={styles.blurBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>New Message:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title..."
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Enter message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button title="Send" onPress={addMessage} />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Cancel"
                  color="red"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Comment Section modal */}
      <CommentSection
        visible={commentModalVisible}
        message={selectedMessage}
        comments={selectedMessage?.comments || []}
        username={username}
        onAddComment={addComment}
        onClose={() => setCommentModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0077b6", padding: 30 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  messageCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  author: { fontWeight: "bold", color: "#03045e" },
  messageTitle: { fontSize: 16, fontWeight: "bold", color: "#0077b6" },
  message: { fontSize: 16, marginVertical: 5, color: "#000" },
  time: { fontSize: 12, color: "#555" },
  commentBtn: { marginTop: 5 },
  commentBtnText: { color: "#0077b6", fontSize: 14, fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#90e0ef",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  addBtnText: { fontSize: 16, color: "#03045e", fontWeight: "bold" },
  blurBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalView: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    width: "90%",
    elevation: 5,
  },
  modalHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#03045e",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  buttonWrapper: { flex: 1, marginHorizontal: 5 },
});
