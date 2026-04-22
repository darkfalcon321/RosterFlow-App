import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";

interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface CommentSectionProps {
  visible: boolean;
  message: any; // replace with Message type if needed
  comments: Comment[];
  username: string;
  onAddComment: (text: string) => Promise<void>;
  onClose: () => void;
}

const CommentSection = ({
  visible,
  message,
  comments,
  username,
  onAddComment,
  onClose,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await onAddComment(newComment);
    setNewComment("");
  };

  const displayedComments = showAll ? comments : comments.slice(0, 10);
  console.log(message)
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={{backgroundColor:"grey",padding:10,marginBottom:10,borderRadius:10}}>
          <Text style={[styles.title,{color:"white"}]}>{message?.title || ""}</Text>
          <Text style={{color:"white"}}>{ message?.text}</Text>
        </View>
        <FlatList
          data={displayedComments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{item.author}:</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
          ListEmptyComponent={<View style={{paddingTop:10}}><Text>No Comments Yet</Text></View>}
          style={{ flex: 1 }}
        />

        {/* Show More / Show Less */}
        {comments.length > 10 && (
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            style={styles.showMoreBtn}
          >
            <Text style={styles.showMoreText}>
              {showAll ? "Show Less" : "Show More"}
            </Text>
          </TouchableOpacity>
        )}

        {/* New Comment Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
            <Text style={styles.addButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  author: { fontWeight: "600", marginRight: 5 },
  text: { flex: 1 },
  time: { fontSize: 10, color: "#555", marginLeft: 5 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  addButton: {
    backgroundColor: "#cc0000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 5,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  closeButton: { marginTop: 15, alignSelf: "center" },
  closeButtonText: { color: "red", fontWeight: "600" },
  showMoreBtn: { alignSelf: "center", marginVertical: 5 },
  showMoreText: { color: "#0077b6", fontWeight: "bold" },
});

export default CommentSection;
