import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import { useAuth } from '@/context/authContext';
import { TouchableOpacity,Text } from "react-native";
import { useRouter } from 'expo-router';
export default function RootLogin() {
    const router = useRouter();
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="forgotPassword" />
                <Stack.Screen name="resetPassword" />
                <Stack.Screen name="tempAdmin" options={{
                    title: "Admin", headerShown: true, headerRight: () => {
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
                <Stack.Screen name="tempCompany" options={{ headerShown: false }}/>
                <Stack.Screen name="tempUser" />
            </Stack>
        </AuthProvider>
    );
}
