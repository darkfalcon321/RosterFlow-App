import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const sendResetLink = async (username: string) => {
    console.log("sending...")
    console.log(username)
    return axios.post(`${BASE_URL}/api/auth/forgot-password`, { 
        username 
    });  
};

export const resetPasswordToken = async (token: string, newPassword: string) => {
    let status;
    try{
        const res = await axios
            .post(`${BASE_URL}/api/auth/reset-password`, { 
                token,
                newPassword
            })
            

        
        status = (await res).status
        
        return status


    } catch(err) {
        console.error(err)
    }

};